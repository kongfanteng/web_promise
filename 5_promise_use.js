/**
 * @example
 *
 * ```js
    // PromiseUse-Promise 应用
    // - 1、Promise 介绍
    // - - Promise 是一个类，意思：承诺、允诺；为异步解决方案；
    // - - Promise 内部有三个状态相互转化
    // - - - pendding 等待状态 -> resolved 成功态 
    // - - - pendding 等待状态 -> rejected 失败态 
    // - - Promise 内部有一个 executor 函数，会立即执行，函数参数为函数 resolve 和函数 reject
    // - - 每个 Promise 实例都有一个 then 方法
    // - - 成功态和失败态不能相互转化
    // - - {@link file://./file/2_promise/1_promise.js}
    let p = new Promise((resolve, reject) => { // executor
      console.log(1)
      resolve('玩具少')
      reject('玩具多')
    })
    p.then(val => { // onFulfilled
      console.log(val, 'success')
    }, err => { // onRejected
      console.log(err, 'fail')
    })
    // 打印：
    // 1
    // 玩具少 success

    * ```
 * 
 */