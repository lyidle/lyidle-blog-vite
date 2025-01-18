export type effectReturnType = {
  onUnMounted: () => void
  onMounted: () => void
}
// 点击特效
export class clickEffectFn {
  onUnMounted: () => void
  onMounted: () => void
  constructor() {
    interface BallType {
      x: number
      vx: number
      y: number
      vy: number
      angle: number
      multiplier: number
      r: number
      color: string
      update: Function
    }
    let width: number, height: number
    let ctx: any
    const canvas = document.createElement("canvas")
    const updateSize = () => {
      canvas.width = window.innerWidth * 2
      canvas.height = window.innerHeight * 2
      canvas.style.width = window.innerWidth + "px"
      canvas.style.height = window.innerHeight + "px"
      ctx.scale(2, 2)
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      origin = {
        x: width / 2,
        y: height / 2,
      }
      normal = {
        x: width / 2,
        y: height / 2,
      }
    }
    let multiplier = 0
    let balls: BallType[] = []
    let longPress: any = null
    let origin: { x: number; y: number }
    let normal: { x: number; y: number }
    const colours = [
      "#F73859",
      "#14FFEC",
      "#00E0FF",
      "#FF99FE",
      "#FAF15D",
    ] as const
    let longPressed: boolean = false
    const pointer = document.createElement("span")
    class Ball {
      public x: number
      public vx: number
      public y: number
      public vy: number
      public angle: number
      public multiplier: number
      public r: number
      public color: string
      constructor(x = origin.x, y = origin.y) {
        this.x = x
        this.y = y
        this.angle = Math.PI * 2 * Math.random()
        if (longPressed == true) {
          this.multiplier = clickEffectFn.randBetween(
            14 + multiplier,
            15 + multiplier
          )
        } else {
          this.multiplier = clickEffectFn.randBetween(6, 12)
        }
        this.vx = (this.multiplier + Math.random() * 0.5) * Math.cos(this.angle)
        this.vy = (this.multiplier + Math.random() * 0.5) * Math.sin(this.angle)
        this.r = clickEffectFn.randBetween(8, 12) + 3 * Math.random()
        this.color = colours[Math.floor(Math.random() * colours.length)]
      }
      update() {
        this.x += this.vx - normal.x
        this.y += this.vy - normal.y
        normal.x = (-2 / window.innerWidth) * Math.sin(this.angle)
        normal.y = (-2 / window.innerHeight) * Math.cos(this.angle)
        this.r -= 0.3
        this.vx *= 0.9
        this.vy *= 0.9
      }
    }
    this.onUnMounted = () => {
      window.removeEventListener("resize", updateSize, false)
      window.removeEventListener("mousedown", onMousedown, false)
      window.removeEventListener("mouseup", onMouseup, false)
      window.removeEventListener("mousemove", onMousemove, false)
    }
    this.onMounted = () => {
      document.body.appendChild(canvas)
      canvas.setAttribute(
        "style",
        "width: 100%; height: 100%; top: 0; left: 0; z-index: var(--click-effect-index); position: fixed; pointer-events: none;"
      )
      pointer.classList.add("pointer")
      document.body.appendChild(pointer)

      if (canvas.getContext && window.addEventListener) {
        ctx = canvas.getContext("2d")
        updateSize()
        window.addEventListener("resize", updateSize, false)
        loop()
        window.addEventListener("mousedown", onMousedown, false)
        window.addEventListener("mouseup", onMouseup, false)
        window.addEventListener("mousemove", onMousemove, false)
      } else {
        console.log("canvas or addEventListener is unsupported!")
      }

      function loop() {
        ctx.fillStyle = "rgba(255, 255, 255, 0)"
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < balls.length; i++) {
          let b = balls[i]
          if (b.r < 0) continue
          ctx.fillStyle = b.color
          ctx.beginPath()
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2, false)
          ctx.fill()
          b.update()
        }
        if (longPressed == true) {
          multiplier += 0.2
        } else if (!longPressed && multiplier >= 0) {
          multiplier -= 0.4
        }
        removeBall()
        requestAnimationFrame(loop)
      }

      function removeBall() {
        for (let i = 0; i < balls.length; i++) {
          let b = balls[i]
          if (
            b.x + b.r < 0 ||
            b.x - b.r > width ||
            b.y + b.r < 0 ||
            b.y - b.r > height ||
            b.r < 0
          ) {
            balls.splice(i, 1)
          }
        }
      }
    }
    const pushBalls = (count = 1, x = origin.x, y = origin.y) => {
      for (let i = 0; i < count; i++) {
        balls.push(new Ball(x, y))
      }
    }
    // 鼠标事件
    const onMousedown = (e: MouseEvent) => {
      pushBalls(clickEffectFn.randBetween(10, 20), e.clientX, e.clientY)
      document.body.classList.add("is-pressed")
      longPress = setTimeout(function () {
        document.body.classList.add("is-longpress")
        longPressed = true
      }, 500)
    }
    const onMouseup = (e: MouseEvent) => {
      clearTimeout(longPress)
      if (longPressed == true) {
        document.body.classList.remove("is-longpress")
        pushBalls(
          clickEffectFn.randBetween(
            50 + Math.ceil(multiplier),
            100 + Math.ceil(multiplier)
          ),
          e.clientX,
          e.clientY
        )
        longPressed = false
      }
      document.body.classList.remove("is-pressed")
    }
    const onMousemove = (e: MouseEvent) => {
      let x = e.clientX
      let y = e.clientY
      pointer.style.top = y + "px"
      pointer.style.left = x + "px"
    }
  }
  static randBetween(min: number, max: number) {
    return Math.floor(Math.random() * max) + min
  }
}
// 鼠标移动特效
export class moveEffectFn {
  onMounted: () => void
  onUnMounted: () => void
  constructor() {
    // 挂载特效
    this.onMounted = () => {
      // 监听屏幕变化事件
      window.addEventListener("resize", resizeCanvas)
      // 监听鼠标移动事件
      window.addEventListener("mousemove", onMousemove)
    }
    // 卸载特效
    this.onUnMounted = () => {
      // 解除监听屏幕变化事件
      window.removeEventListener("resize", resizeCanvas)
      // 解除监听鼠标移动事件
      window.removeEventListener("mousemove", onMousemove)
    }
    //定义数组，arr存放每个小星星的信息，colour为颜色数组，存几个好看的颜色
    type arrType = {
      dx: number
      x: number
      y: number
      dy: number
      td: number
      rot: number
      r: number
      color: string
    }[]
    var arr: arrType = []
    var colours = ["#ffff00", "#66ffff", "#3399ff", "#99ff00", "#ff9900"]
    var timeoutList: NodeJS.Timeout[] = [] // 计时器列表-用于后续清理计时器

    // 创建画布
    const canvas = document.createElement("canvas")
    document.body.appendChild(canvas)
    var ctx: any = canvas.getContext("2d")
    // 让画布自适应窗口大小，这个复制即可
    function resizeCanvas() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    // 给画布css样式，固定定位，且阻止用户的鼠标事件
    canvas.style.cssText = `
    position: fixed;
    z-index: var(--move-effect-index);
    top: 0;
    left: 0;
    pointer-events: none;
  `

    // 封装绘制一个五角星函数
    // x是圆心横坐标，y是圆心纵坐标，其实就是鼠标位置（x ，y）
    // r是里面小圆半径 ，l是大圆半径
    // rot是初始旋转角度
    function star(x: number, y: number, r: number, l: number, rot: number) {
      ctx.beginPath()
      // 循环5次，因为5个点
      for (let i = 0; i < 5; i++) {
        //先绘制小圆上一个点
        ctx.lineTo(
          Math.cos(((18 + i * 72 - rot) * Math.PI) / 180) * r + x,
          -Math.sin(((18 + i * 72 - rot) * Math.PI) / 180) * r + y
        )
        //连线到大圆上一个点
        ctx.lineTo(
          Math.cos(((54 + i * 72 - rot) * Math.PI) / 180) * l + x,
          -Math.sin(((54 + i * 72 - rot) * Math.PI) / 180) * l + y
        )
      }
      ctx.closePath()
    }

    // 绘制一堆星星
    function draw() {
      //循环数组
      for (let i = 0; i < arr.length; i++) {
        let temp = arr[i]
        //调用绘制一个星星函数
        star(temp.x, temp.y, temp.r, temp.r * 3, temp.rot)
        //星星颜色
        ctx.fillStyle = temp.color
        //星星边框颜色
        ctx.strokeStyle = temp.color
        //线宽度
        ctx.lineWidth = 0.1
        //角有弧度
        ctx.lineJoin = "round"
        // 填充
        ctx.fill()
        // 绘制路径
        ctx.stroke()
      }
    }

    //更新动画
    function update() {
      //循环数组
      for (let i = 0; i < arr.length; i++) {
        // x坐标+dx移动距离
        arr[i].x += arr[i].dx
        // y坐标+dy移动距离
        arr[i].y += arr[i].dy
        // 加上旋转角度
        arr[i].rot += arr[i].td
        // 半径慢慢减小
        arr[i].r -= 0.015
        // 当半径小于0时
        if (arr[i].r < 0) {
          //删除该星星
          arr.splice(i, 1)
        }
      }
    }

    // 添加当前位置星星数据
    function addStarts(e: MouseEvent) {
      // 每移动触发一次事件给arr数组添加一个星星
      arr.push({
        // x是初始横坐标
        x: e.clientX,
        //y是初始纵坐标
        y: e.clientY,
        //r是星星里面那个小圆半径，哪来的小圆等会说
        r: Math.random() * 0.5 + 1.5,
        //运动时旋转的角度
        td: Math.random() * 4 - 2,
        // X轴移动距离
        dx: Math.random() * 2 - 1,
        // y轴移动距离
        dy: Math.random() * 1 + 1,
        // 初始的旋转角度
        rot: Math.random() * 90 + 90,
        // 颜色
        color: colours[Math.floor(Math.random() * colours.length)],
      })
    }
    function onMousemove(e: MouseEvent) {
      // 添加星星数据
      addStarts(e)
      //设置100毫秒内效果
      for (let index: number = 0; index < 200; index++) {
        if (index === 0 && timeoutList.length > 0) {
          for (const timeoutName of timeoutList) {
            clearTimeout(timeoutName)
          }
        }
        timeoutList[index] = setTimeout(() => {
          //清屏
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          //绘制
          draw()
          //更新
          update()
        }, index * 20)
      }
    }
  }
}
// 离开窗口和回来的提示标题
export const setTitleTip = () => {
  // 设置标题离开和回来的提示语
  let temp: string
  let tipFlag = JSON.parse(import.meta.env.VITE_TITLE_TIP_SHOW) ?? true
  const leaveTip = import.meta.env.VITE_LEAVE_TITLE_TIP || "不要离开~"
  const enterTip = import.meta.env.VITE_ENTER_TITLE_TIP || "欢迎回来~"
  const envDur = parseFloat(import.meta.env.VITE_TITLE_TIP_DURING)
  const tipDuring = isNaN(envDur) ? 1 : envDur
  let enterTimer: any
  let leaveTimer: any
  // 窗口获取焦点的回调
  const enterCallback = () => {
    // 非空判断
    if (!temp) return
    // 回来时都要清除离开的定时器避免错乱
    clearTimeout(leaveTimer)
    // 提示
    document.title = enterTip
    enterTimer = setTimeout(() => {
      // 恢复
      document.title = temp
      // 清除定时器
      clearTimeout(enterTimer)
    }, tipDuring * 1000)
  }
  // 窗口失去焦点的回调
  const leaveCallback = () => {
    // 非空判断
    if (!document.title) return
    // 离开时记录
    if (document.title !== leaveTip && document.title !== enterTip)
      temp = document.title
    // 提示
    document.title = leaveTip
    leaveTimer = setTimeout(() => {
      // 恢复
      document.title = temp
      // 清除定时器
      clearTimeout(leaveTimer)
    }, tipDuring * 1000)
  }
  nextTick(() => {
    if (tipFlag) {
      window.addEventListener("focus", enterCallback)
      window.addEventListener("blur", leaveCallback)
    }
  })
}
