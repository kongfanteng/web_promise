const fs = require('fs')
const path = require('path')
const after = (times, callback) => {
  let result = {}
  return (key, data) => {
    result[key] = data
    if (--times === 0) callback(result)
  }
}
const newFn = after(2, (result) => { // 这个方法会在所有异步执行完成后执行
  console.log('result:', result) // result: { name: 'web_promise_learn', age: '1' }
})
/** {@link file://./name.txt} */
fs.readFile(path.join(__dirname, './name.txt'), 'utf8', function (err, data) {
  if (err) return console.log('err:', err)
  newFn('name', data)
})
/** {@link file://./age.txt} */
fs.readFile(path.join(__dirname, './age.txt'), 'utf8', function (err, data) {
  if (err) return console.log('err:', err)
  newFn('age', data)
})
