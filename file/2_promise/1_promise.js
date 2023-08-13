let p = new Promise((resolve, reject) => {
  // executor
  console.log(1)
  resolve('玩具少')
  reject('玩具多')
})
p.then(
  (val) => {
    // onFulfilled
    console.log(val, 'success')
  },
  (err) => {
    // onRejected
    console.log(err, 'fail')
  }
)
// 打印：
// 1
// 玩具少 success