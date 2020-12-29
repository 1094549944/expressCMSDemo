/*
 * @Author: jiaxinying
 * @Date: 2020-12-22 11:13:55
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-23 16:14:51
 * 文章
 * 图片上传模块
 * 1. 安装
 * cnpm install koa-multer --save
 * 
 * 2. 引入
 * const multer = require('koa-multer')
 * 
 * 3. 配置上传以后的目录的文件名称
 * 4. 接收数据
 * 注意：post 
 * 注意：form 表单必须加上 enctype="multipart/form-data"
 * 注意：上传的图片目录要存在
 * 
 * 
 */
const router = require('koa-router')()
const DB = require('../../model/db')
const tools = require('../../model/tools')
// 图片上传模块
const multer = require('koa-multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {


    cb(null, 'public/upload');   /*配置图片上传的目录     注意：图片上传的目录必须存在*/
  },
  filename: function (req, file, cb) {   /*图片上传完成重命名*/
    var fileFormat = (file.originalname).split(".");   /*获取后缀名  分割数组*/
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})

const upload = multer({ storage: storage })


router.get('/', async (ctx) => {
  const page = ctx.query.page || 1
  let pageSize = 5
  // 查询总数量
  const count = await DB.count('article', {})
  const result = await DB.find('article', {}, {}, {
    page,
    pageSize
  })
  await ctx.render('admin/article/index', {
    list: result,
    page: page,
    totalPages: Math.ceil(count / pageSize)
  })
})

router.get('/add', async (ctx) => {
  //查询分类数据

  var catelist = await DB.find('articlecate', {})
  await ctx.render('admin/article/add', {
    catelist: tools.cateToList(catelist)
  })

})

// 富文本编辑
// router.get('/ueditor', async (ctx) => {
//   await ctx.render('admin/article/ueditor')
// })



// post 接收数据
router.post('/doAdd', upload.single('img_url'), async (ctx) => {

  const reqBody = ctx.req.body

  const pid = reqBody.pid
  const catename = reqBody.catename.trim()
  const title = reqBody.title.trim()

  const author = reqBody.author.trim()
  const pic = reqBody.author
  const status = reqBody.status

  const is_best = reqBody.is_best
  const is_hot = reqBody.is_hot
  const is_new = reqBody.is_new

  const keywords = reqBody.keywords || ''
  const description = reqBody.description || ''
  const content = reqBody.content || ''
  const img_url = ctx.req.file ? ctx.req.file.path : '';

  //属性的简写
  const json = {
    pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content, img_url
  }
  const result = DB.insert('article', json)

  //跳转
  ctx.redirect(ctx.state.__HOST__ + '/admin/article');

})

// 编辑页面
router.get('/edit', async (ctx) => {
  // 查询分类数据
  const id = ctx.query.id
  const catelist = await DB.find('articlecate', {})
  // 当前要编辑的数据
  const articlelist = await DB.find('article', { "_id": DB.getObjectId(id.toString()) })
  await ctx.render('admin/article/edit', {
    catelist: tools.cateToList(catelist),
    list: articlelist[0],
    prevPage: ctx.state.G.prevPage   /*保存上一页的值*/
  })
})

// 编辑接口
router.post('/doEdit', upload.single('img_url'), async (ctx) => {
  const reqBody = ctx.req.body
  let prevPage = reqBody.prevPage || '';  /*上一页的地址*/
  let id = reqBody.id;

  const pid = reqBody.pid
  const catename = reqBody.catename.trim()
  const title = reqBody.title.trim()

  const author = reqBody.author.trim()
  const pic = reqBody.author
  const status = reqBody.status

  const is_best = reqBody.is_best
  const is_hot = reqBody.is_hot
  const is_new = reqBody.is_new

  const keywords = reqBody.keywords || ''
  const description = reqBody.description || ''
  const content = reqBody.content || ''
  const img_url = ctx.req.file ? ctx.req.file.path : ''
  //属性的简写
  if (img_url) {
    var json = {
      pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content, img_url
    }
  } else {
    var json = {
      pid, catename, title, author, status, is_best, is_hot, is_new, keywords, description, content
    }
  }

  DB.update('article', { "_id": DB.getObjectId(id) }, json);


  //跳转
  if (prevPage) {
    ctx.redirect(prevPage);

  } else {
    ctx.redirect(ctx.state.__HOST__ + '/admin/article');
  }
})


module.exports = router.routes()