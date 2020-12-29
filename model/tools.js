const md5 = require('md5')
const multer = require('koa-multer')
const tools = {
  multer () {
    // 上传图片
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'public/upload')
      },
      filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".")
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1])
      }
    })
    var upload = multer({ storage: storage })
    return upload
  },
  getTime () {
    // 获取时间
    return new Date()
  },
  md5 (str) {
    return md5(str)
  },
  // 类别转成列表
  cateToList (data) {
    const firstArr = []
    // 把第一层列表循环出来
    for (let index = 0;index < data.length;index++) {
      const element = data[index];
      if (element.pid == '0') {
        firstArr.push(data[index])
      }

    }
    // 把小类别循环出来
    for (let item = 0;item < firstArr.length;item++) {
      firstArr[item].list = []

      for (let j = 0;j < data.length;j++) {
        if (firstArr[item]._id === data[j].pid) {
          firstArr[item].list.push(data[j])
        }
      }
    }
    return firstArr
  }
}
module.exports = tools