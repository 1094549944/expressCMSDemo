/*
 * @Author: jiaxinying
 * @Date: 2020-12-18 18:21:08
 * @Last Modified by: jiaxinying
 * @Last Modified time: 2020-12-22 11:51:00
 * mongodb 的方法封装
 */
const MongoDB = require('mongodb')
const MongoClient = MongoDB.MongoClient
const ObjectID = MongoDB.ObjectID


const Config = require('./config')


/**
 * 封装数据库方法
 */
class Db {
  // 静态方法
  // 获取实例
  static getInstance () {
    if (!Db.instance) {
      Db.instance = new Db()
    }
    return Db.instance
  }
  // 类的构造函数
  constructor() {
    this.dbClient = ''
    this.connect()
    // 连接数据库 是个异步方法

  }
  connect () {
    return new Promise((resolve, reject) => {
      // 如果没有连接，那么就连接
      if (!this.dbClient) {
        MongoClient.connect(Config.dbUrl, {
          useUnifiedTopology: true
        }, (err, client) => {
          if (err) {
            reject(err)
          } else {
            this.dbClient = client.db(Config.dbName)
          }
        })
      } else {
        console.log('连接上了');
        resolve(this.dbClient)
      }
    })
  }
  // 类的方法
  // 查找
  find (collectionName, json1, json2, json3) {
    // const attr = {}
    // let slipNum = 0;
    // let pageSize = 0;
    // let page = 1;

    if (arguments.length == 2) {
      var attr = {};
      var slipNum = 0;
      var pageSize = 0;

    } else if (arguments.length == 3) {
      var attr = json2;
      var slipNum = 0;
      var pageSize = 0;
    } else if (arguments.length == 4) {
      var attr = json2;
      var page = json3.page || 1;
      var pageSize = json3.pageSize || 20;
      var slipNum = (page - 1) * pageSize;
    } else {
      console.log('�����������')
    }

    return new Promise((resolve, reject) => {

      this.connect().then((db) => {

        var result = db.collection(collectionName).find(json1, { fields: attr }).skip(slipNum).limit(pageSize)

        result.toArray(function (err, docs) {

          if (err) {
            reject(err);
            return;
          }
          resolve(docs);
        })

      })
    })
  }
  // 更新
  update (collectionName, json1, json2) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).updateOne(json1, {
          $set: json2
        }, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }

        })
      })
    })
  }
  // 插入
  insert (collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).insertOne(json, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    })
  }
  // 删除
  remove (collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        db.collection(collectionName).removeOne(json, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      })
    })

  }
  // 获取id
  getObjectId (id) {
    return new ObjectID(id);
  }
  // 获取数量
  count (collectionName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then((db) => {
        const result = db.collection(collectionName).count(json)
        result.then((count) => {
          resolve(count)
        })
      })
    })
  }

}
module.exports = Db.getInstance()
