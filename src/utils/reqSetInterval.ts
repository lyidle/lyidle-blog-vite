export default (cb: Function, time: number) => {
  let i: number = 0
  let flag: boolean = true
  let timer: any
  timer = requestAnimationFrame(function fn() {
    if (!flag) {
      cancelAnimationFrame(timer)
      return
    }
    i++
    if (i % parseInt(`${60 / (1000 / time)}`) === 0) {
      cb()
    }
    timer = requestAnimationFrame(fn)
  })
  return {
    close: () => {
      flag = false
    },
    flag,
  }
}
