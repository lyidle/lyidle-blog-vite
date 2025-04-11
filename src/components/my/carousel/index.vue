<template>
  <div class="carousel-container">
    <div
      class="carousel"
      ref="carousel"
      @mouseenter="enterCb"
      @mouseleave="leaveCb"
      :style="{
        '--carousel-len': len,
        '--carousel-dur': transit,
      }"
    >
      <div class="content" ref="content">
        <!--key 有id就使用id 没有就使用index -->
        <div
          v-for="(item, index) in props.data"
          class="data-item"
          ref="itemInstance"
          :key="item.id ? item.id : index"
        >
          <!-- 使用插槽回传 数据 -->
          <slot :item :index name="body">
            <div class="myItem">
              {{ index + 1 }}
            </div>
          </slot>
        </div>
      </div>
    </div>

    <div class="btn">
      <template v-for="(_, i) in props.data">
        <div
          class="item"
          :class="{ active: index === i }"
          @click="btnMove(i)"
          @mouseenter="enterCb"
          @mouseleave="leaveCb"
        >
          <slot name="btns" :index="i">{{ i + 1 }}</slot>
        </div>
      </template>
    </div>
    <div class="arrow" ref="arrow">
      <div
        class="item"
        @mouseenter="enterCb"
        @mouseleave="leaveCb"
        @click="rollPlay(-1)"
      >
        <slot name="pre">
          <div>&lt;</div>
        </slot>
      </div>
      <div
        class="item"
        @mouseenter="enterCb"
        @mouseleave="leaveCb"
        @click="rollPlay(1)"
      >
        <slot name="next">
          <div>&gt;</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="MyCarousel">
// 引入 hooks
import { useEventListener } from "@/hooks/useEventListener"
// 引入 自制 setInterval
import reqSetInterval from "@/utils/reqSetInterval"
// 引入 节流
import throttle from "@/utils/throttle"
const props = withDefaults(
  defineProps<{
    data: any
    autoplay?: boolean
    direction?: "left" | "top"
    dur?: number
    gap?: number
  }>(),
  {
    autoplay: false,
    direction: "left",
    dur: 1000,
    gap: 1500,
  }
)
const index = ref(0) //轮播的索引
const dur = props.dur //过渡时间
const transit = dur / 1000 + "s" //过渡 动画的时间
const arrowDur = 0.5 //切换按钮 显示与隐藏的过渡时间
const gap = props.gap //自动轮播的间隔时间
const carousel = ref() //获取到轮播的容器
const len = props.data.length //获取到有多少个轮播元素 没有克隆图的干扰
// 创建方向位置的映射关系
const map = {
  left: "row",
  top: "column",
}
//自动轮播的定时器 使用自制的 requestAnimationFrame
let timer: ReturnType<typeof reqSetInterval> | null = null

// 移动的回调函数
const move = (num: number, flag: boolean = true) => {
  if (!carousel.value) return
  if (flag) {
    carousel.value.style.transition = `${props.direction} ${transit}`
    carousel.value.style[props.direction] = `${-num * 100}%`
  } else {
    carousel.value.style.transition = `${props.direction} ${0}s`
    carousel.value.style[props.direction] = `${-num * 100}%`
  }
}

// 轮播的动画 回调 1 和 -1 控制方向 使用节流 来实现动画过渡中不能点击
const rollPlay = throttle((add: -1 | 1 = 1) => {
  // 自增
  index.value += add
  // 先移动到索引 位置
  move(index.value)
  // 当移动到 最后一张图时 是克隆图 瞬间移动到第一张
  if (index.value === len) {
    // 重置索引
    index.value = 0
    // 等到达最后一张的动画播放完毕后
    let tim: setTimout | null = setTimeout(() => {
      // 没有动画的 到达到第一张
      move(index.value, false)
      if (tim) clearTimeout(tim)
      tim = null
    }, dur)
  }
  // 第一张时  往左走 会变成是-1
  if (index.value === -1) {
    // 更新索引 为最后的一个元素 len数据没有克隆元素干扰
    index.value = len
    // 无动画的到达最后一张克隆元素
    move(len, false)
    // 到达应该要去的元素位置
    let tim: setTimout | null = setTimeout(() => {
      move(--index.value)
      if (tim) clearTimeout(tim)
      tim = null
    }, 0)
  }
}, dur)

// num 点击的第几个按钮
// 点击按钮的回调
const btnMove = (num: number) => {
  index.value = num
  // 移动到对应位置
  move(num)
}

// 切换按钮的组件实例
const arrow = ref()

// 存储 事件
let eventWindowBlur: null | (() => void) = null
let eventWindowFocus: null | (() => void) = null
let eventWindWheel: null | (() => void) = null

// 自动轮播的回调
const initAutoPlay = () => {
  // 判断是否自动轮播
  if (!props.autoplay) return
  // 使用的自制的 requestAnimationFrame
  timer = reqSetInterval(() => {
    rollPlay(1)
  }, gap)
  // 失焦 取消轮播
  eventWindowBlur = useEventListener("blur", windowBlur)
  // 聚焦 轮播
  eventWindowFocus = useEventListener("focus", windowFocus)
}

// 浏览器 聚焦的回调
const windowFocus = () => {
  // 自动轮播
  initAutoPlay()
}

// 浏览器 失焦的回调
const windowBlur = () => {
  // 轮播
  timer?.cancel()
  timer = null
}

// 卸载轮播 函数
const unAutoPlay = () => {
  // 调用浏览器失去焦点的函数
  windowBlur()
  // 清除事件
  eventWindowBlur?.()
  eventWindowFocus?.()
}

// 鼠标移入 函数
const enterCb = () => {
  // 调用浏览器失去焦点的函数
  windowBlur()
  // 左右切换按钮出现
  arrow.value.style.opacity = "1"
  arrow.value.style.transition = `opacity ${arrowDur}s`
  // 初始化 滚轮事件
  initScroll()
}

// 鼠标移出 函数
const leaveCb = () => {
  // 自动轮播
  initAutoPlay()
  // 取消 滚动事件
  unScroll()
  // 左右切换隐藏
  arrow.value.style.opacity = "0"
}

// 鼠标滚轮事件函数
const initScroll = () => {
  eventWindWheel = useEventListener("wheel", scrollCb, { passive: false })
}

// 取消鼠标滚轮事件函数
const unScroll = () => {
  eventWindWheel?.()
}

// 鼠标滚轮事件的回调函数
const scrollCb = (e: WheelEvent) => {
  e.preventDefault()
  if (!e.deltaY) return
  // 往下滚动
  if (e.deltaY > 0) {
    // 滚动动画
    rollPlay(1)
  }
  // 往上滚动
  if (e.deltaY < 0) {
    // 滚动动画
    rollPlay(-1)
  }
}

// 初始化
// 轮播的每一项
const itemInstance = ref()
// 轮播的容器
const content = ref()

// 组件挂载初始化
onMounted(() => {
  if (itemInstance.value?.[0])
    // 把第一个复制一份 添加到最后 实现无缝轮播
    content.value.appendChild(itemInstance.value?.[0].cloneNode(true))
  carousel.value.style[props.direction] = "0"
  // 确定 flex 布局方向
  content.value.style.flexDirection = map[props.direction]
  // 自动轮播回调
  initAutoPlay()
  // 初始化切换按钮
  arrow.value.style.opacity = "0"
})
// 组件卸载
onUnmounted(() => {
  // 取消自动轮播
  unAutoPlay()
  // 取消悬浮滚动事件
  unScroll()
})
</script>

<style scoped lang="scss">
$btn-gap: 10px;
$btn-mr: 20px;
$btn-radius: 10px;
$arrow-color: #7b9fcb;
$arrow-bg: rgba(141, 188, 220, 0.7);
$btns-color: #2a4f7c;
$btns-bg: rgba(141, 188, 220, 0.7);
.carousel-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  .carousel {
    width: calc(100% * var(--carousel-len) + 1);
    height: 100%;
    position: relative;
    > .content {
      width: calc(100% / var(--carousel-len) + 1);
      height: 100%;
      position: relative;
      display: flex;
      .data-item {
        width: 100%;
        height: 100%;
        flex-shrink: 0;
      }
      .myItem {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 26px;
        background-color: white;
      }
    }
  }
  .arrow {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    margin: auto;
    pointer-events: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: opacity 0.5s;
    .item {
      pointer-events: all;
      cursor: pointer;
      width: 30px;
      height: 50px;
      background-color: $arrow-bg;
      color: $arrow-color;
      /* 内容居中 */
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      cursor: pointer;
      div {
        transform: scaleY(1.5) translateY(-2px);
      }
    }
  }
  // 按钮
  .btn {
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    cursor: pointer;
    pointer-events: none;
    /* 靠右边显示 */
    justify-content: flex-end;
    .item {
      width: 20px;
      height: 18px;
      margin-right: 10px;
      margin-bottom: 10px;
      border-radius: 5px;
      font-size: 12px;
      color: $btns-color;
      background-color: $btns-bg;
      display: flex;
      /* 内容居中显示 */
      justify-content: center;
      align-items: center;
      transition: width var(--carousel-dur), height var(--carousel-dur);
      cursor: pointer;
      pointer-events: all;
      &.active {
        width: 80px;
      }
    }
  }
}
</style>
