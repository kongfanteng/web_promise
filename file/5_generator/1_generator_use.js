let fs = require('mz/fs')
let path = require('path')
function* read() {
  let r = yield fs.readFile(path.join(__dirname, './name.txt'), 'utf8')
  let age = yield fs.readFile(path.join(__dirname, r), 'utf8')
  return age
}
let it = read()
let { value, done } = it.next()
value.then((data) => {
  let { value, done } = it.next(data)
  value.then((data) => {
    let { value, done } = it.next(data)
    console.log('value:', value) // value: 18
  })
})
