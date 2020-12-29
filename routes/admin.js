/*
 * @Author: jiaxinying 
 * @Date: 2020-12-18 19:46:49 
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-24 16:06:14
 * 管理员
 */
const url = require('url')
const router = require('koa-router')();
const index = require('./admin/index')
const login = require('./admin/login')
const user = require('./admin/user')
const manage = require('./admin/manage')
const articlecate = require('./admin/articlecate')
const article = require('./admin/article');
var focus = require('./admin/focus.js');
var link = require('./admin/link.js');
var nav = require('./admin/nav.js');
var setting = require('./admin/setting.js')

// 访问接口session 判定
router.use(async (ctx, next) => {
  // 获取模板引擎配置全局的变量
  ctx.state.__HOST__ = `http://${ctx.request.header.host}`

  // 获取路径名
  const pathname = url.parse(ctx.request.url).pathname.substring(1)


  //左侧菜单选中
  var splitUrl = pathname.split('/');
  //全局的userinfo
  ctx.state.G = {
    url: splitUrl,
    userinfo: ctx.session.userinfo,
    prevPage: ctx.request.headers['referer']   /*上一页的地址*/
  }

  // 权限判断
  if (ctx.session.userinfo) {
    await next()
  } else {
    // 如果没有用户信息，那么判断，是不是登录，登录接口，获取验证码
    if (pathname === 'admin/login' || pathname == 'admin/login/doLogin' || pathname == 'admin/login/code') {
      await next()
    } else {
      // 跳转到登录页面
      ctx.redirect('/admin/login')

    }

  }
})



router.get('/', async (ctx) => {
  ctx.render('admin/index');
})
router.use(index)
router.use('/login', login)
router.use('/user', user)
router.use('/manage', manage)
router.use('/articlecate', articlecate)
router.use('/article', article)
router.use('/focus', focus)
router.use('/link', link)
router.use('/nav', nav)
router.use('/setting', setting)

module.exports = router.routes()