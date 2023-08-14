function Promise(executor) {
  let self = this
  // 给 Promise 定义状态
  self.status = 'pendding'
  // 成功结果和失败的原因
  self.value = undefined
  self.reason = undefined
  self.onResolveCallbacks = [] // 存放成功的回调
  self.onRejectCallbacks = [] // 存放失败的回调
  function resolve(value) {
    if (self.status === 'pendding') {
      self.value = value
      self.status = 'fulfilled'
      self.onResolveCallbacks.forEach(fn => fn())
    }
  }
  function reject(reason) {
    if (self.status === 'pendding') {
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

function resolvePromise(promise2, x, resolve, reject){
  // 对 x 判断，x 为普通值时，直接 resolve
  // x 为 promise2 时，调用 reject() 参数-new TypeError('循环引用')
  if (promise2 === x) { // 防止返回的 Promise 和 then 返回的 Promise 是同一个
    return reject(new TypeError('循环引用'))
  }
  let called
  // - - - - 判断 x 为普通值，判断 x !== null && (typeof x === 'object' || typeof x === 'function')
  if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    try{
      let then = x.then // trycatch-当前 Promise 可能没有 then 方法，捕捉错误
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject) // - - 调用 then 方法时，如果 then 返回方法仍为 Promise，需要递归至 then 返回值为常量为止
        }, r => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    }catch(e){
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

Promise.prototype.then = function (onfulfilled, onrejected) {
  // 保证 then 的成功与失败回调可以透传
  onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : val => val
  onrejected = typeof onrejected === 'function' ? onrejected : err => { throw err }
  let self = this
  // - - - 返回新的 promise，让当前 then 执行后可以继续 then
  let promise2 = new Promise(function(resolve, reject){
    if (self.status === 'fulfilled') {
      // 如果状态成功，则调用 onfulfilled
      // 获取到成功回调 onfulfilled 和 失败回调 onrejected 的结果，分别 resolve 和 reject 掉，命名 x
      setTimeout(() => {
        try{
          let x = onfulfilled(self.value)
          resolvePromise(promise2, x, resolve, reject)
        }catch(e){
          reject(e)
        }
      })
    }
    if (self.status === 'rejected') {
      // 如果状态失败，则调用 onrejected
      setTimeout(() => {
        try{
          let x = onrejected(self.reason)
          resolvePromise(promise2, x, resolve, reject)
        }catch(e){
          reject(e)
        }
      })
    }
    if (self.status === 'pendding') {
      self.onResolveCallbacks.push(function(){
        setTimeout(() => {
          try{
            let x = onfulfilled(self.value)
            resolvePromise(promise2, x, resolve, reject)
          }catch(e){
            reject(e)
          }
        })
      })
      self.onRejectCallbacks.push(function(){
        setTimeout(() => {
          try{
            let x = onrejected(self.reason)
            resolvePromise(promise2, x, resolve, reject)
          }catch(e){
            reject(e)
          }
        })
      })
    }
  })
  return promise2;
}

Promise.deferred = function() {
  let dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

Promise.prototype.catch = function(callback) {
  return this.then(null, callback)
}

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

Promise.prototype.finnaly = function(callback){
  let P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason }),
  )
}

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

module.exports = Promise
