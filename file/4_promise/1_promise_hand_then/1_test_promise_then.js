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
      if (err) return reject(err)
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

