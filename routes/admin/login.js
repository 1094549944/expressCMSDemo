/*
 * @Author: jiaxinying
 * @Date: 2020-12-19 15:16:24
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-23 11:54:43
 * 用户登录
 *
 */


const router = require('koa-router')()
const tools = require('../../model/tools')
const DB = require('../../model/db')
console.log(DB);

// 验证码
const svgCaptcha = require('svg-captcha')

// 登录页面
router.get('/', async (ctx) => {
  await ctx.render('admin/login')
})
// 验证码
router.get('/code', async (ctx) => {
  const captcha = svgCaptcha.create({
    size: 4,
    fontSize: 50,
    width: 120,
    height: 34,
    background: "#cc9966"
  });
  ctx.session.code = captcha.text;

  // 设置响应头
  ctx.response.type = 'image/svg+xml'
  ctx.body = captcha.data

})

// 登录接口
router.post('/doLogin', async (ctx) => {
  let { username, password, code } = ctx.request.body
  // 验证用户名，密码是否合法
  // 去数据库匹配
  // 用户信息写入session
  // 验证验证码
  if (code.toLocaleLowerCase() == ctx.session.code.toLocaleLowerCase()) {
    // 从admin 的数据库中查找是否有对应的数据
    const result = await DB.find(
      'admin', {
      'username': username,
      password: tools.md5(password)
    }
    )

    if (result.length > 0) {
      ctx.session.userinfo = result[0];
      // 更新用户表，改变用户登录的时间
      await DB.update('admin', {
        '_id': DB.getObjectId(result[0]._id)
      }, {
        last_time: new Date()
      })


      ctx.redirect(ctx.state.__HOST__ + '/admin');
    } else {
      ctx.render('admin/error', {
        message: '用户名或者密码错误',
        redirect: ctx.state.__HOST__ + '/admin/login'
      })
    }
  } else {
    ctx.render('admin/error', {
      message: '验证码失败',
      redirect: ctx.state.__HOST__ + '/admin/login'
    })
  }

})

// 退出接口
router.get('loginOut', async (ctx) => {
  // 设置session 为null
  ctx.session.userinfo = null

  // 重定向到登录页面
  ctx.redirect(ctx.state.__HOST__ + 'admin/login')
})

module.exports = router.routes()