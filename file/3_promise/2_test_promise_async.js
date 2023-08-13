let Promise = require('./promise.js')
let p = new Promise((resolve, reject) => {
  // executor
  setTimeout(() => {
    resolve('成功触发异步方法')
  }, 1000)
})
p.then((val) => {
  console.log(val, 'success') // 成功触发异步方法 success
})
