Function.prototype.before = function(callback) {
  let self = this // 
  return function(){ // 返回的函数的 this 指向 newFn() 前的 this，当前 node running 指向 global
    callback() // before 参数
    self.apply(self, arguments)
  }
}
function fn(val){
  console.log('fn: 函数功能！' + val)
}
let newFn = fn.before(function(){
  console.log('在函数执行前执行')
})
newFn('你好')