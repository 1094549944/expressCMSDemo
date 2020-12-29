/*
 * @Author: jiaxinying
 * @Date: 2020-12-21 16:26:00
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-22 11:13:38
 * 文章分类列表
 */
const router = require('koa-router')()
const DB = require('../../model/db')
const tools = require('../../model/tools')

router.get('/', async (ctx) => {
  const result = await DB.find('articlecate', {})
  await ctx.render('admin/articlecate/index', {
    list: tools.cateToList(result)
  })
})

// 获取一级分类
router.get('/add', async (ctx) => {
  const result = await DB.find('articlecate', { 'pid': '0' })
  await ctx.render('admin/user/add', {
    catelist: result
  });

})

// 添加一级分类
router.post('/doAdd', async (ctx) => {
  const addData = ctx.request.body
  const result = await DB.insert('articlecate', addData)
  ctx.redirect(`${ctx.state.__HOST__}/admin/articlecate`)
})

// 编辑页面
router.get('/edit', async (ctx) => {
  const id = ctx.query.id
  const result = await DB.find('articlecate', { "_id": DB.getObjectId(id.toString()) })
  const articlecate = await DB.find('articlecate', { 'pid': '0' })
  await ctx.render('admin/articlecate/edit', {
    list: result[0] || [],
    catelist: articlecate,

  })

})
// 编辑提交
router.post('/doEdit', async (ctx) => {
  const { id, title, pid, keywords, status, description } = ctx.request.body

  const result = await DB.update('articlecate', {
    '_id': DB.getObjectId(id.toString())
  },
    {
      title, pid, keywords, status, description
    }
  )
  // 更新完成跳转到分类页面
  ctx.redirect(ctx.state.__HOST__ + '/admin/articlecate')
})

router.get('/delete', async (ctx) => {

  ctx.body = "删除用户";

})

module.exports = router.routes()




