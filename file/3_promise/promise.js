function Promise(executor) {
  let self = this
  // 给 Promise 定义状态
  self.status = 'pendding'
  // 成功结果和失败的原因
  self.value = undefined
  self.reason = undefined
  self.onResolveCallbacks = [] // 存放成功的回调
  self.onRejectCallbacks = [] // 存放失败的回调
  function resolve(value) {
    if (self.status === 'pendding') {
      self.value = value
      self.status = 'fulfilled'
      self.onResolveCallbacks.forEach(fn => fn())
    }
  }
  function reject(reason) {
    if (self.status === 'pendding') {
      self.reason = reason
      self.status = 'rejected'
      self.onRejectCallbacks.forEach(fn => fn())
    }
  }

  try {
    // 执行器立即执行
    executor(resolve, reject)
  } catch (e) {
    reject(e)
  }
}
Promise.prototype.then = function (onfulfilled, onrejected) {
  let self = this
  if (self.status === 'fulfilled') {
    // 如果状态成功，则调用 onfulfilled
    onfulfilled(self.value)
  }
  if (self.status === 'rejected') {
    // 如果状态失败，则调用 onrejected
    onrejected(self.reason)
  }
  if (self.status === 'pendding') {
    this.onResolveCallbacks.push(function(){
      onfulfilled(self.value)
    })
    this.onRejectCallbacks.push(function(){
      onrejected(self.reason)
    })
  }
}
module.exports = Promise
