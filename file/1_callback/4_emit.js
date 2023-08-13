const EventEmitter = function () {
  this._arr = []
}
EventEmitter.prototype.on = function (callback) {
  // 订阅
  this._arr.push(callback)
}
EventEmitter.prototype.emit = function () {
  // 发布，发布时，需要让 on 依次执行
  this._arr.forEach((fn) => fn.apply(this, arguments))
}
let e = new EventEmitter()



const fs = require('fs')
const path = require('path')
fs.readFile(path.join(__dirname, './name.txt'), 'utf8', function (err, data) {
  if (err) return console.log('err:', err)
  e.emit(data, 'name')
})
fs.readFile(path.join(__dirname, './age.txt'), 'utf8', function (err, data) {
  if (err) return console.log('err:', err)
  e.emit(data, 'age')
})

const school = {}
e.on((data, key) => {
  school[key] = data
  if (Object.keys(school).length === 2) {
    console.log('school:', school)
  }
})