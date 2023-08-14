/**
 * @example
 *
 * ```js
    // Promise-原型方法
    // - 1、延迟对象 deferred 的应用
    // - - {@link file://./file/4_promise/2_promise/name.txt}: KFT
    // - - {@link file://./file/4_promise/2_promise/Promise.js}
    // - - {@link file://./file/4_promise/2_promise/1_test_promise.js}
    let Promise = require('./promise')
    let fs = require('fs')
    let path = require('path')
    function read(url) {
      let defer = Promise.deferred() // { promise, resolve, reject }
      fs.readFile(url, 'utf8', (err, data) => {
        if (err) return defer.reject(err)
        return defer.resolve(data)
      })
      return defer.promise
    }
    read(path.join(__dirname, './name.txt')).then(data => {
      console.log('data:', data)
    })

    // - 2、catch：捕捉错误返回
    // - - catch 为 then 的简写
    // - - - {@link file://./file/4_promise/2_promise/Promise.js}
    Promise.prototype.catch = function(callback) {
      return this.then(null, callback)
    }
    // - - 验证，函数 catchTest
    // - - - {@link file://./file/4_promise/2_promise/1_test_promise.js}
    function catchTest() {
      let p = new Promise((resolve, reject) => {
        reject(123)
      })
      p.then(null, err => {
        throw err
      }).catch(e=>{
        console.log('e:', e) // e: 123
      }).then(data => {
        console.log('data:', data) // data: undefined
      })
    }
    catchTest()

    // - 3、Promise.resolve 和 Promise.reject
    Promise.resolve = function(value) {
      return new Promise((resolve, reject) => {
        resolve(value)
      })
    }
    Promise.reject = function(reason) {
      return new Promise((resolve, reject) => {
        reject(reason)
      })
    }

    // - 4、finnaly-一定会触发的函数
    Promise.prototype.finnaly = function(callback){
      let P = this.constructor
      return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {throw reason}),
      )
    }
    // - - 参考：{@link https://es6.ruanyifeng.com/#docs/promise#Promise-prototype-finally}

    // - 5、Promise.all Promise.race promisify-Promise 化
    // - - {@link file://./file/4_promise/2_promise/age.txt}
    // - - 1）Promise.all
    // - - - {@link file://./file/4_promise/2_promise/2_test_promise.js}
    let Promise = require('./3_promise_all_race')
    function read(url) {
      const fs = require('fs')
      const path = require('path')
      let defer = Promise.deferred() // { promise, resolve, reject }
      fs.readFile(path.join(__dirname, url), 'utf8', (err, data) => {
        if (err) return defer.reject(err)
        return defer.resolve(data)
      })
      return defer.promise
    } 
    function promiseAllTest() {
      Promise.all([read('./age.txt'), read('./name.txt'), 1, 2, 3]).then(data => {
        console.log('data:', data)
      }, err => {
        console.log('err:', err)
      })
    }
    promiseAllTest()

    // - - - {@link file://./file/4_promise/2_promise/3_promise_all_race.js}
    Promise.all = function(values) {
      return new Promise((resolve, reject) => {
        let arr = []
        let count = 0
        function processData(key, value) {
          arr[key] = value // 将结果和数据对应起来
          if(++count === values.length){
            resolve(arr) // 全部成功把结果抛出
          }
        }
        for(let i = 0; i < values.length; i++) {
          let current = values[i]
          let then = current.then
          // 判断是 Promise，调用
          if (then && typeof then === 'function'){
            then.call(current, y => {
              processData(i , y)
            }, reject) // 如果其中一个 Promise 出错停止执行
          } else {
            resolve(current)
          }
        }
      })
    }

    // - - - {@link file://./file/4_promise/2_promise/3_promise_all_race.js}
    Promise.race = function(values) {
      return new Promise((resolve, reject) => {
        for(let i = 0; i < values.length; i++) {
          let current = values[i]
          let then = current.then
          // 判断是 Promise，调用
          if (then && typeof then === 'function'){
            then.call(current, y => {
              resolve(i , y)
            }, reject) // 如果其中一个 Promise 出错停止执行
          } else {
            resolve(current)
          }
        }
      })
    }

    // - - 2）promisify-方法 Promise 化
    // - - - {@link file://./file/4_promise/2_promise/2_test_promise.js}
    function promisifyTest(){
      function promisify(){}
      let read = promisify(fs.readFile)
      read(path.join(__dirname, './name.txt'), 'utf8').then(data => {
        console.log('data:', data) // data: KFT
      })
    }
    promisifyTest()

    // - - - promisify() 逻辑
    function promisify(fn) { // 把方法 Promise 化
      return function(){
        return new Promise((resolve, reject) => {
          fn(...arguments, function(err, data) {
            if (err) reject(err)
            resolve(data)
          })
        })
      }
    }

    // - - -（1）promisifyAll
    // - - - - {@link file://./file/4_promise/2_promise/2_test_promise.js}
    function promisifyAll(obj){
      for(let key in obj) {
        obj[key+'Async'] = promisify(obj[key])
      }
    }
    promisifyAll(fs)
    fs.readFileAsync(path.join(__dirname, './name.txt'), 'utf8').then(data => {
      console.log('data:', data) // data: KFT
    })

    // - - - Promise 方法包 bluebird
    // - - - fs 方法 进行Promise 化包 mz/fs
    let fs = require('mz/fs')
    fs.readFile('name.txt', 'utf8').then(data => {
      console.log('data:', data)
    })

    * ```
 * 
 */