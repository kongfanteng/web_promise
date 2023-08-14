
let Promise = require('./3_promise_all_race')
const fs = require('fs')
const path = require('path')

function read(url) {
  let defer = Promise.deferred() // { promise, resolve, reject }
  fs.readFile(path.join(__dirname, url), 'utf8', (err, data) => {
    if (err) return defer.reject(err)
    return defer.resolve(data)
  })
  return defer.promise
} 
function promiseAllTest() {
  Promise.all([read('./age.txt'), read('./name.txt'), 1, 2, 3]).then(data => {
    console.log('data:', data) // data: 1
  }, err => {
    console.log('err:', err)
  })
}

function promiseRaceTest() {
  Promise.race([read('./age.txt'), read('./name.txt'), 1, 2, 3]).then(data => {
    console.log('data:', data) // data: [ '18', 'KFT', 1, 2, 3 ]
  }, err => {
    console.log('err:', err)
  })
}

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
function promisifyTest(){
  let read = promisify(fs.readFile)
  read(path.join(__dirname, './name.txt'), 'utf8').then(data => {
    console.log('data:', data) // data: KFT
  })
}

function promisifyAll(obj){
  for(let key in obj) {
    obj[key+'Async'] = promisify(obj[key])
  }
}
promisifyAll(fs)
fs.readFileAsync(path.join(__dirname, './name.txt'), 'utf8').then(data => {
  console.log('data:', data) // data: KFT
})