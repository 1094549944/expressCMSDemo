/*
 * @Author: jiaxinying
 * @Date: 2020-12-24 15:46:40
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-25 15:34:13
 * 设置
 */

const router = require('koa-router')()
const DB = require('../../model/db')
const tools = require('../../model/tools')



router.get('/', async (ctx) => {
  const result = await DB.find('setting', {})
  console.log('系统设置', result);
  await ctx.render('admin/setting/index', {
    list: result[0]
  })
})


router.post('/doEdit', tools.multer().single('site_logo'), async (ctx) => {
  const { site_title, site_description, site_keywords, site_icp, site_qq, site_tel, site_address, site_status } = ctx.req.body
  const site_logo = ctx.req.file ? ctx.req.file.path.substr(7) : ''
  const add_time = tools.getTime()


  if (site_logo) {
    var json = {
      site_title, site_logo, site_keywords, site_description, site_icp, site_qq, site_tel, site_address, site_status, add_time

    }
  } else {
    var json = {
      site_title, site_keywords, site_description, site_icp, site_qq, site_tel, site_address, site_status, add_time

    }

  }

  await DB.update('setting', {}, json);
  ctx.redirect(ctx.state.__HOST__ + '/admin/setting')

})

module.exports = router.routes()


