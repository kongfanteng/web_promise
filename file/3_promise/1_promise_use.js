let Promise = require('./promise.js')
let p = new Promise((resolve, reject) => {
  // executor
  throw new Error('报错')
})
p.then((val) => {
  console.log(val, 'success')
}, reason => {
  console.log(reason.message, 'fail') // 报错 fail
})
