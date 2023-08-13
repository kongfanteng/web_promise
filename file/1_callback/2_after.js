function after(times, callback) {
  return function () {
    if (--times === 0) {
      callback()
    }
  }
}
let newFn = after(3, function () {
  console.log('after: 调用完成')
})
newFn()
newFn()
newFn() // after: 调用完成
