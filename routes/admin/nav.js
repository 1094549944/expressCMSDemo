/*
 * @Author: jiaxinying
 * @Date: 2020-12-24 15:03:04
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-24 16:14:49
 * 菜单栏
 */
const router = require('koa-router')()
const DB = require('../../model/db')
const tools = require('../../model/tools')

router.get('/', async (ctx) => {
  const result = await DB.find('nav', {})

  await ctx.render('admin/nav/list', {
    list: result
  })
})
// 增加页面
router.get('/add', async (ctx) => {
  await ctx.render('admin/nav/add')
})

// 增加 操作

router.post('/doAdd', async (ctx) => {
  console.log(ctx.req);
  var title = ctx.request.body.title;

  var url = ctx.request.body.url;

  var sort = ctx.request.body.sort;

  var status = ctx.request.body.status;

  var add_time = tools.getTime();

  await DB.insert('nav', { title, url, sort, status, add_time });

  //跳转
  ctx.redirect(ctx.state.__HOST__ + '/admin/nav')
})


// 编辑页面
router.get('/edit', async (ctx) => {
  const id = ctx.query.id
  const result = await DB.find('nav', {
    '_id': DB.getObjectId(id.toString())
  })
  await ctx.render('admin/nav/edit', {
    list: result[0],
    prevPage: ctx.state.G.prevPage
  })
})

// 去编辑
router.post('/doEdit', async (ctx) => {
  const { id, title, url, sort, status, prevPage } = ctx.request.body
  const add_time = tools.getTime()
  await DB.update('nav', { "_id": DB.getObjectId(id) }, { title, url, sort, status, add_time })

  //跳转
  if (prevPage) {
    ctx.redirect(prevPage);
  } else {
    //跳转
    ctx.redirect(ctx.state.__HOST__ + '/admin/nav');

  }

})

module.exports = router.routes()






