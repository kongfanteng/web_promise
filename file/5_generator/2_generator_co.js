let fs = require('mz/fs')
let path = require('path')
function* read() {
  let r = yield fs.readFile(path.join(__dirname, './name.txt'), 'utf8')
  let age = yield fs.readFile(path.join(__dirname, r), 'utf8')
  return age
}
// let co = require('co')
function co(it) {
  return new Promise((resolve, reject) => {
    function next(val) {
      let { value, done } = it.next(val)
      if (done){
        return resolve(value)
      }
      Promise.resolve(value).then(data => {
        next(data)
      }, reject)
    }
    next()
  })
}
co(read())
  .then((data) => {
    console.log('data:', data) // data: 18
  })
  .catch((e) => {
    console.log('e:', e)
  })
