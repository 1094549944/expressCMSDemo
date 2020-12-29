/*
 * @Author: jiaxinying
 * @Date: 2020-12-24 10:31:11
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-24 16:10:26
 */
const router = require('koa-router')()
const DB = require('../../model/db')
const tools = require('../../model/tools')

// 导航列表
router.get('/', async (ctx) => {
  const page = ctx.query.page || 1
  const pageSize = 3
  const result = await DB.find('link', {}, {}, {
    page,
    pageSize,
    sortJson: {
      'add_time': -1
    }
  })
  const count = await DB.count('link', {}) // 总数量

  await ctx.render('admin/link/list', {
    list: result,
    page: page,
    totalPages: Math.ceil(count / pageSize)
  })
})


router.get('/add', async (ctx) => {
  await ctx.render('admin/link/add')
})

// 增加导航
router.post('/doAdd', tools.multer().single('pic'), async (ctx) => {
  // 增加数据到数据库
  const { title, url, sort, status } = ctx.req.body

  const pic = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  const add_time = tools.getTime()

  await DB.insert('link', {
    title, pic, url, sort, status, add_time
  })

  //跳转
  ctx.redirect(ctx.state.__HOST__ + '/admin/link')


})


router.get('/edit', async (ctx) => {
  var id = ctx.query.id;


  var result = await DB.find('link', { "_id": DB.getObjectId(id) });

  console.log(result)

  await ctx.render('admin/link/edit', {
    list: result[0],
    prevPage: ctx.state.G.prevPage
  })
})

// 执行编辑数据
router.post('/doEdit', tools.multer().single('pic'), async (ctx) => {
  const { id, title, url, sort, status, prevPage } = ctx.req.body

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
  await DB.update('link', { '_id': DB.getObjectId(id) }, json)

  if (prevPage) {
    ctx.redirect(prevPage);
  } else {
    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/link');

  }
})


module.exports = router.routes()


