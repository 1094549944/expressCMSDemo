/*
 * @Author: jiaxinying 
 * @Date: 2020-12-18 19:46:39 
 * @Last Modified by:   jiaxinying 
 * @Last Modified time: 2020-12-18 19:46:39 
 * 接口文档
 */
var router = require('koa-router')();


router.get('/', async (ctx) => {

  ctx.body = "api接口";

})

module.exports = router.routes();