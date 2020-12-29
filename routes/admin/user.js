/*
 * @Author: jiaxinying
 * @Date: 2020-12-18 19:51:31
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-18 19:54:32
 * 用户管理
 */
const router = require('koa-router')()
router.get('/', async (ctx) => {
  ctx.body = '用户列表'
})
router.get('/add', async (ctx) => {
  ctx.body = '用户添加'
})
router.get('/edit', async (ctx) => {
  ctx.body = "编辑用户"
})
router.get('/delete', async (ctx) => {
  ctx.body = '删除用户'
})

module.exports = router.routes()