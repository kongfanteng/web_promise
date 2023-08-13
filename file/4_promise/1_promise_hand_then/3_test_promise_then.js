let Promise = require('./2_promise_then')
let p = new Promise((resolve, reject) => {
  resolve()
})
let promise2 = p.then(data => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(123)
    }, 1000);
  })
}, err => {
  return err + 400
})
promise2.then(data => {
  console.log(data, 'success') // 123 success
}, err => {
  console.log(err, 'fail')
})
promise2.then().then().then(data => {
  console.log(data, 'success') // 123 success
})