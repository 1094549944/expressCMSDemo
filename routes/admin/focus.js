/*
 * @Author: jiaxinying
 * @Date: 2020-12-23 16:58:11
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-24 16:07:20
 */

const router = require('koa-router')()

const DB = require('../../model/db')

const tools = require('../../model/tools')

// 获取列表
router.get('/', async (ctx) => {
  const page = ctx.query.page || 1

  const pageSize = 3

  const result = await DB.find('focus', {}, {}, {
    page, pageSize, sortJson: {
      "add_time": -1
    }
  })
  var count = await DB.count('focus', {});  /*总数量*/
  await ctx.render('admin/focus/list', {
    list: result,
    page: page,
    totalPages: Math.ceil(count / pageSize)
  })

})

router.get('/add', async (ctx) => {
  await ctx.render('admin/focus/add')
})
router.post('/doAdd', tools.multer().single('pic'), async (ctx) => {

  // 增加到数据库
  const reqBody = ctx.req.body
  const { title, url, sort, status } = reqBody
  const pic = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  const add_time = tools.getTime()
  await DB.insert('focus', {
    title, pic, url, sort, status, add_time
  })
  //跳转
  ctx.redirect(ctx.state.__HOST__ + '/admin/focus')
})

// 编辑
router.get('/edit', async (ctx) => {
  const id = ctx.query.id
  const result = await DB.find('focus', { "_id": DB.getObjectId(id.toString()) })

  await ctx.render('admin/focus/edit', {
    list: result[0],
    prevPage: ctx.state.G.prevPage
  })
})

// 编辑数据
router.post('/doEdit', tools.multer().single('pic'), async (ctx) => {
  const reqBody = ctx.req.body

  const { id, title, url, sort, status, prevPage } = reqBody
  const pic = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  const add_time = tools.getTime()
  if (pic) {

    var json = {

      title, pic, url, sort, status, add_time
    }
  } else {
    var json = {

      title, url, sort, status, add_time
    }

  }
  await DB.update('focus', { '_id': DB.getObjectId(id) }, json)

  if (prevPage) {
    ctx.redirect(prevPage);
  } else {
    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/focus');

  }
})

module.exports = router.routes()




