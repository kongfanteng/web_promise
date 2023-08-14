let fs = require('mz/fs')
let path = require('path')
async function read() {
  let r = await fs.readFile(path.join(__dirname, './name.txt'), 'utf8')
  let age = await fs.readFile(path.join(__dirname, r), 'utf8')
  let e = await [age]
  return e
}
read().then((data) => {
  console.log('data:', data) // data: [ '18' ]
})
