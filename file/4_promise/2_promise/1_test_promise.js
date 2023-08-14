let Promise = require('./promise')
let fs = require('fs')
let path = require('path')
/**
 * 读取文件（Promise）
 * @param {string} url - 文件地址
 * @returns {Promise} 读取结果的 Promise 实例
 * @example
 *
 * ```js
    // 调用
    read(path.join(__dirname, './name.txt')).then((data) => {
      console.log('data:', data)
    })
 * ```
 * 
 */
function read(url) {
  let defer = Promise.deferred() // { promise, resolve, reject }
  fs.readFile(url, 'utf8', (err, data) => {
    if (err) return defer.reject(err)
    return defer.resolve(data)
  })
  return defer.promise
} 

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



