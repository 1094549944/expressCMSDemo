/*
 * @Author: jiaxinying
 * @Date: 2020-12-21 15:21:49
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-23 17:57:00
 */

const router = require('koa-router')()
const DB = require('../../model/db')

router.get('/', async (ctx) => {
  ctx.render('admin/index')
})

router.get('/changeStatus', async (ctx) => {
  const { collectionName, attr, id } = ctx.query.collectionName // 数据库表名 属性 更新的id
  const data = await DB.find(collectionName, {
    "_id": DB.getObjectId(id)
  })
  const json = null
  if (data.length > 0) {
    getStatusSuccess(data, attr, json, collectionName)
  } else {
    ctx.body = { "message": '更新失败,参数错误', "success": false };
  }

})

// 获取状态成功 的方法封装
async function getStatusSuccess (data, attr, json, collectionName) {
  if (data[0][attr] == 1) {
    json = { /*es6 属性名表达式*/
      [attr]: 0
    };
  } else {
    json = {
      [attr]: 1
    };
  }
  const updateResult = await DB.update(collectionName, {
    "_id": DB.getObjectId(id),
    json
  })
  if (updateResult) {
    return ctx.body = { "message": '更新成功', "success": true };
  } else {
    return ctx.body = { "message": "更新失败", "success": false }
  }
}

// 改变排序的ajax 接口
router.get('/changeSort', async (ctx) => {
  const { collectionName, id, sortValue } = ctx.query
  // 更新的数据
  var json = {

    sort: sortValue
  }
  let updateResult = await DB.update(collectionName, { "_id": DB.getObjectId(id) }, json);

  if (updateResult) {
    ctx.body = { "message": '更新成功', "success": true };
  } else {
    ctx.body = { "message": "更新失败", "success": false }
  }
})




// 公共删除方法
router.get('/remove', (ctx) => {
  try {
    const { collection, id } = ctx.query // 数据库表 删除id
    const result = DB.remove(collection, { '_id': DB.getObjectId(id.toString()) })
    ctx.redirect(ctx.state.G.prevPage)

  } catch (error) {
    ctx.redirect(ctx.state.G.prevPage)
  }
})


module.exports = router.routes()

