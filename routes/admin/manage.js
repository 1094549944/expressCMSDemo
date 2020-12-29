const router = require('koa-router')()
const DB = require('../../model/db')
const tools = require('../../model/tools')
// 获取管理员列表
router.get('/', async (ctx) => {
  const result = await DB.find('admin', {})
  await ctx.render('admin/manage/list', {
    list: result
  })
})

// 添加管理员页面
router.get('/add', async (ctx) => {
  await ctx.render('admin/manage/add')
})
// 添加管理员接口
router.post('/doAdd', async (ctx) => {
  /**
   * 1. 获取表单提交的数据
   * 2. 验证表单数据是否合法
   * 3. 在数据库查询当前要增加的管理员是否存在
   * 4. 增加管理员
   */
  const { username, password, rpassword } = ctx.request.body
  if (!/^\w{4,20}/.test(username)) {
    await ctx.render('admin/error', {
      message: '用户名不合法',
      redirect: ctx.state.__HOST__ + '/admin/manage/add'
    })
  }
  if (password != rpassword || password.length > 6) {
    await ctx.render('admin/error', {
      message: '密码和确认密码不一致，或者密码长度小于6位',
      redirect: ctx.state.__HOST__ + '/admin/manage/add'
    })
  }
  // 数据库查询当前管理员是否存在
  const findResult = await DB.find('admin', {
    username
  })
  if (findResult.length > 0) {
    await ctx.render('admin/error', {
      message: '次级管理员已经存在，请换个用户名',
      redirect: ctx.state.__HOST__ + '/admin/manage/add'
    })
  } else {
    const addResult = await await DB.insert('admin', { "username": username, "password": tools.md5(password), "status": 1, "last_time": '' });
    ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
  }



})


// 编辑管理员页面
router.get('/edit', async (ctx) => {
  const id = ctx.query.id

  const result = await DB.find("admin", { "_id": DB.getObjectId(id) })
  await ctx.render('admin/manage/edit', {
    list: result[0]
  })
})

// 编辑管理员
router.post('/doEdit', async (ctx) => {
  try {
    const { id, password, rpassword } = ctx.request.body


    if (password != '') {
      if (password != rpassword || password.length > 6) {

        await ctx.render('admin/error', {
          message: '密码和确认密码不一致，或者密码长度小于6位',
          redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
        })

      } else {
        //更新密码
        const updateResult = await DB.update('admin', { "_id": DB.getObjectId(id) }, { "password": tools.md5(password) });
        ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
      }
    } else {

      ctx.redirect(ctx.state.__HOST__ + '/admin/manage');
    }

  } catch (err) {
    await ctx.render('admin/error', {
      message: err,
      redirect: ctx.state.__HOST__ + '/admin/manage/edit?id=' + id
    })

  }
})



// 删除管理员
router.get('/delete', async (ctx) => {
  ctx.body = '删除用户'
})


module.exports = router.routes()







