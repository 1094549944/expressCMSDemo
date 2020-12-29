const Koa = require('koa')
const app = new Koa()
const onerror = require('koa-onerror')
const logger = require('koa-logger')
const session = require('koa-session')
const render = require('koa-art-template')
const path = require('path')
const static = require('koa-static')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const sd = require('silly-datetime')
const jsonp = require('koa-jsonp')
const cors = require('koa2-cors')


// const index = require('./routes/index')
// const users = require('./routes/users')

//  error handler
onerror(app)
// post 提交数据中间件
app.use(bodyParser());
// middlewares
// app.use(bodyparser({
//   enableTypes: ['json', 'form', 'text']
// }))
// 日志
// app.use(logger())

// 配置jsonp 的中间件
app.use(jsonp())
//配置后台允许跨域    允许跨域安全性如何解决       签名验证
app.use(cors())
// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  // console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})



//配置session的中间件

app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa:sess',
  maxAge: 864000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,   /*每次请求都重新设置session*/
  renew: false,
};
app.use(session(CONFIG, app));

//配置模板引擎
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production',
  dateFormat: dateFormat = function (value) {
    return sd.format(value, 'YYYY-MM-DD HH:mm');
  }
});
//配置 静态资源的中间件
app.use(static(__dirname + '/public'));

//引入模块
var index = require('./routes/index.js');
var api = require('./routes/api.js');
var admin = require('./routes/admin.js');

router.use('/admin', admin);
router.use('/api', api);
app.use(index)
app.use(router.routes());   /*启动路由*/
app.use(router.allowedMethods());


// error-handling
app.on('error', (err, ctx) => {
  // console.error('server error', err, ctx)
});

module.exports = app
