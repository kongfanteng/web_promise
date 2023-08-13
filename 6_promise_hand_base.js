/**
 * @example
 *
 * ```js
    // PromiseHandwriting-手写 Promise（无 then-链式调用）
    // - 1、生成文件 promise.js 和 1_promise_use.js
    // - - {@link file://./file/3_promise/promise.js}
    // - - {@link file://./file/3_promise/1_promise_use.js}

    // - 2、promise.js 逻辑
    // - - {@link file://./file/3_promise/promise.js}
    function Promise(executor){
      // 给 Promise 定义状态
      this.status = 'pendding'
      // 成功结果和失败的原因
      this.value = undefined
      this.reason = undefined
      let self = this
      function resolve(value) {
        if (self.status === 'pendding') {
          self.value = value
          self.status = 'fulfilled'
        }
      }
      function reject(reason) {
        if (self.status === 'pendding') {
          self.reason = reason
          self.status = 'rejected'
        }
      }

      // 执行器立即执行
      executor(resolve, reject)
    }
    Promise.prototype.then = function(onfulfilled, onrejected) {
      let self = this
      if (self.status === 'fulfilled') { // 如果状态成功，则调用 onfulfilled
        onfulfilled(self.value)
      }
      if (self.status === 'rejected') { // 如果状态失败，则调用 onrejected
        onrejected(self.reason)
      }
    }
    module.exports = Promise

    // - 3、1_promise_use.js 逻辑
    // - - {@link file://./file/3_promise/1_promise_use.js}
    let Promise = require('./promise.js')
    let p = new Promise((resolve, reject) => { // executor
      throw new Error('报错')
    })
    p.then(val => {
      console.log(val, 'success')
    })
    // - - 报错：Error: 报错
    // - - 解决：promise.js 中执行器进行 trycatch
    // - - {@link file://./file/3_promise/promise.js}
    try {
      executor(resolve, reject)
    } catch(e){
      reject(e)
    }

    // - 4、promise.js 定义两个队列存放成功和失败对应的回调（解决异步）
    // - - {@link file://./file/3_promise/promise.js}
    // - - Promise 函数
    self.onResolveCallbacks = [] // 存放成功的回调
    self.onRejectCallbacks = [] // 存放失败的回调
    // - - then 函数：状态为 pendding 状态时，存放失败或成功方法
    if (self.status === 'pendding') {
      this.onResolveCallbacks.push(function(){
        onfulfilled(self.value)
      })
      this.onRejectCallbacks.push(function(){
        onrejected(self.reason)
      })
    }
    // - - Promise 函数
    // - - - 调用 resolve 与 reject 方法时，取出存放的对应方法调用
    function resolve(value) {
      if (self.status === 'pendding') {
        // ...
        self.onResolveCallbacks.forEach(fn => fn())
      }
    }
    function reject(reason) {
      if (self.status === 'pendding') {
        // ...
        self.onRejectCallbacks.forEach(fn => fn())
      }
    }
    // - - 调试
    // - - {@link file://./file/3_promise/2_test_promise_async.js}
    let Promise = require('./promise.js')
    let p = new Promise((resolve, reject) => { // executor
      setTimeout(() => {
        resolve('成功触发异步方法') // 成功触发异步方法 success
      }, 1000)
    })
    p.then(val => {
      console.log(val, 'success')
    })

    * ```
 * 
 */