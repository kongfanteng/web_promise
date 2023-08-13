/**
 * @example
 *
 * ```js
    // PromiseHand-Then-手写 Promise 链式调用
    // - 1、手写 Promise 源码文件-链式调用-2_promise_then.js
    // - - {@link file://./file/4_promise/1_promise_hand_then/2_promise_then.js}
    function Promise(executor) {
      let self = this
      // 给 Promise 定义状态
      self.status = 'pending'
      // 成功结果和失败的原因
      self.value = undefined
      self.reason = undefined
      self.onResolveCallbacks = [] // 存放成功的回调
      self.onRejectCallbacks = [] // 存放失败的回调
      function resolve(value) {
        if (self.status === 'pending') {
          self.value = value
          self.status = 'fulfilled'
          self.onResolveCallbacks.forEach(fn => fn())
        }
      }
      function reject(reason) {
        if (self.status === 'pending') {
          self.reason = reason
          self.status = 'rejected'
          self.onRejectCallbacks.forEach(fn => fn())
        }
      }

      try {
        // 执行器立即执行
        executor(resolve, reject)
      } catch (e) {
        reject(e)
      }
    }
    Promise.prototype.then = function (onfulfilled, onrejected) {
      let self = this
      if (self.status === 'fulfilled') {
        // 如果状态成功，则调用 onfulfilled
        onfulfilled(self.value)
      }
      if (self.status === 'rejected') {
        // 如果状态失败，则调用 onrejected
        onrejected(self.reason)
      }
      if (self.status === 'pending') {
        self.onResolveCallbacks.push(function(){
          onfulfilled(self.value)
        })
        self.onRejectCallbacks.push(function(){
          onrejected(self.reason)
        })
      }
    }
    module.exports = Promise


    // - 2、调试 Promise 文件-1_test_promise.js
    // - - {@link file://./file/4_promise/1_promise_hand_then/name.txt}-内容 `./age.txt`
    // - - {@link file://./file/4_promise/1_promise_hand_then/age.txt}-内容 `10086`
    // - - {@link file://./file/4_promise/1_promise_hand_then/1_test_promise_then.js}
    const fs = require('fs')
    const path = require('path')
    // fs.readFile(path.join(__dirname, './name.txt'), 'utf8', function (err, data) {
    //   fs.readFile(path.join(__dirname, data), 'utf8', function (err, data) {
    //     console.log('data:', data)
    //   })
    // })
    let Promise = require('./2_promise_then.js')
    function readPromise(url) {
      return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, url), 'utf8', function (err, data) {
          if(err) return reject(err)
          resolve(data)
        })
      })
    }
    // 链式调用，非 jQuery 方式返回 this
    readPromise('./name.txt').then(data=>{
      return readPromise(data)
    }).then(data => {
      console.log(data, 1)
      return 100
    }, err => {
      console.log('err:', err)
    }).then(data => {
      console.log(data, 2)
    })

    // - 3、then 方法逻辑
    // - - 1）如果 then 方法中返回的是一个 Promise，那就采用这个 Promise 的状态作为成功或者失败，把 Promise 的结果作为参数
    // - - 2）如果返回的是一个普通值，直接作为下一个 then 成功的参数
    // - - 3）在 then 方法中抛出异常，也会走失败，如果错误中返回一个普通值，也会变成成功态
    // - - 每一个 then 方法都返回一个新的 Promise

    // - 4、then 方法实现
    // - - 1）返回的 Promise 函数，命名 promise2
    // - - - {@link file://./file/4_promise/1_promise_hand_then/2_promise_then.js}
    // - - - 返回新的 promise，让当前 then 执行后可以继续 then
    let promise2 = new Promise(function(resolve, reject){
      // 获取到成功回调 onfulfilled 和 失败回调 onrejected 的结果，分别 resolve 和 reject 掉，命名 x
      let x = onfulfilled(self.value)
      resolve(x)
      // ...
      let x = onrejected(self.reason)
      reject(x)
    })
    return promise2;
    // - - - 对于返回结果 x，判断其为 Promise 还是普通值，返回结果的处理函数 resolvePromise(promise2, x, resolve, reject)
    function resolvePromise(promise2, x, resolve, reject){
      resolve(x) // 为调试临时处理
    }
    // - - - 对 x 处理全部替换为 resolvePromise
    resolvePromise(promise2, x, resolve, reject)

    // - - - promise2 在同步状态下为 undefined，使用 setTimeout 解决
    setTimeout(() => {
      // ...
      resolvePromise(promise2, x, resolve, reject)
    })

    // - - - 调用返回 x 的函数时有可能报错，使用 trycatch 捕捉
    try{
      // ...
      resolvePromise(promise2, x, resolve, reject)
    }catch(e){
      reject(e)
    }

    // - - - resolvePromise 逻辑
    // - - - - {@link file://./file/4_promise/1_promise_hand_then/2_promise_then.js}
    // - - - - 参数 promise2 为当前 then 返回的 Promise
    // - - - - 参数 x 为当前 then 中成功或失败的返回结果
    function resolvePromise(promise2, x, resolve, reject){
      // 对 x 判断，x 为普通值时，直接 resolve
      // x 为 promise2 时，调用 reject() 参数-new TypeError('循环引用')
      if (promise2 === x) {
        return reject(new TypeError('循环引用'))
      }
    }
    // - - - - 判断 x 为普通值，判断 x !== null && (typeof x === 'object' || typeof x === 'function')
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      // ...
    } else {
      resolve(x)
    }
    // - - - - 对 x 为 Promise 时，调用 x 的 then 方法，使用 trycatch 捕捉错误
    try{
      let then = x.then // trycatch-当前 Promise 可能没有 then 方法，捕捉错误
      if (typeof then === 'function') {
        then.call(x, y => {
          resolve(y)
        }, r => {
          reject(r)
        })
      } else {
        resolve(x)
      }
    }catch(e){
      reject(e)
    }

    // - - - - 调用 then 方法时，如果 then 返回方法仍为 Promise，需要递归至 then 返回值为常量为止
    then.call(x, y => {
      resolvePromise(promise2, y, resolve, reject)
    }, r => {
      // ...
    })

    // - - 调试
    // - - - {@link file://./file/4_promise/1_promise_hand_then/3_test_promise_then.js}

    // - 5、resolvePromise 注释说明
    // - - - {@link file://./file/4_promise/1_promise_hand_then/2_promise_then.js}
    // - - 防止循环引用
    if(promise2 === x){ // 防止返回的 Promise 和 then 返回的 Promise 是同一个
      // ...
    }

    // - 6、保证 then 的成功与失败回调可以透传
    // - - {@link file://./file/4_promise/1_promise_hand_then/2_promise_then.js}
    // - - then 方法
    onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : val => val
    onrejected = typeof onrejected === 'function' ? onrejected : err => { throw err }

    // - 7、需要兼容他人的 Promise，通过定义 called 判断是否已调用自身的 Promise
    let called
    then.call(x, y => {
      if (called) return
      called = true
      // ...
    }, r => {
      if(called) return
      called = true
      // ...
    })

    try{
      // ...
    } catch(e) {
      if(called) return
      called = true
      reject(e)
    }
    
    // - 8、测试手写 Promise 是否正确
    // - - 安装 promises-aplus-tests 包
    sudo npm i promises-aplus-tests -g

    // - - {@link file://./file/4_promise/1_promise_hand_then/2_promise_then.js}
    Promise.deferred = function() {
      let dfd = {}
      dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
      })
      return dfd
    }

    // - - 测试
    promises-aplus-tests 2_promise_then.js
  

    * ```
 * 
 */