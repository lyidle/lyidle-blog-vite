<template>
  <div v-if="isShowPanel" class="dialog-wrapper">
    <div class="dialog-container" ref="containter">
      <div
        class="title cur-move"
        ref="title"
        :style="{
          height: titleHeight,
        }"
      >
        <slot name="title"></slot>
        <div class="btns">
          <!-- 关闭 按钮 -->
          <div class="close cur-pointer btn-item">
            <i
              class="i-material-symbols:close-rounded"
              @click="isShowPanel = false"
            ></i>
          </div>
        </div>
      </div>
      <!-- 内容区 -->
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" name="MyDialog">
import { mitt } from "@/utils/emitter"

const isShowPanel = defineModel()
// 初始化 props
const props = withDefaults(
  defineProps<{
    closeDur?: string
    closeColor?: string
    closeColorHover?: string
    mask?: string
    bg?: string
    titleBg?: string
    color?: string
    titleColor?: string
    titleHeight?: string
  }>(),
  {
    closeDur: ".3s",
    closeColor: "#2a4f7c",
    closeColorHover: "rgb(74.2289156627, 128.1686746988, 193.7710843373)",
    mask: "#0000005a",
    bg: "rgb(204.7056603774, 224.5698113208, 238.0943396226)",
    titleBg: "#88b7d7",
    color: "#2a4f7c",
    titleColor: "white",
  }
)
const {
  closeDur,
  closeColor,
  closeColorHover,
  mask,
  bg,
  titleBg,
  color,
  titleColor,
} = props
// 初始化时显示的位置信息
let savedPanelLeft = defineModel("left")
let savedPanelTop = defineModel("top")
let isPanelPositionSaved = defineModel("isSave")

// 监听 是否隐藏 面板
//  面板显示
const open = () => {
  document.documentElement.style.overflow = "hidden"
  // 需要页面渲染后 才能获取到元素 绑定移动事件
  nextTick(() => {
    const tar = title.value as HTMLDivElement
    const wrap = containter.value as HTMLDivElement
    // 绑定 鼠标 按下事件
    tar.addEventListener("mousedown", handlerMousedown)
    // 得到几何信息
    const rect = wrap.getBoundingClientRect()
    // 得到 宽高的 一半
    const width = rect.width / 2
    const height = rect.height / 2
    // 得到 窗口的 width 和 height
    const innerWidth = window.innerWidth
    const innerHeight = window.innerHeight
    // 初始 left 和 top
    let left = `${
      (isPanelPositionSaved.value && savedPanelLeft.value) ||
      innerWidth / 2 - width
    }`
    let top = `${
      (isPanelPositionSaved.value && savedPanelTop.value) ||
      innerHeight / 2 - height
    }`

    // 判断 是否超出
    if (+left + rect.width > innerWidth) left = "0"
    if (+top + rect.height > innerHeight) top = "0"
    // 初始化位置
    wrap.style.left = left + "px"
    wrap.style.top = top + "px"
  })
}

//  面板隐藏
const close = () => {
  document.documentElement.style.overflow = "unset"
  // 解绑事件
  const tar = title.value as HTMLDivElement
  tar?.removeEventListener("mousedown", handlerMousedown)
}
watch(
  () => isShowPanel.value,
  (newV) => {
    if (newV) {
      open()
    } else {
      close()
    }
  }
)
// 拖拽
// 获取 容器
// 获取 头部 容器
const title = ref()
const containter = ref()

// 移动的参数
// 移动的范围
let rangeX = 0
let rangeY = 0
// 鼠标按下 时 鼠标的位置
let curY = 0
let curX = 0
// 鼠标按下 时 container容器的top和left值
let wrapTop = 0
let wrapLeft = 0

// 鼠标 按下
const handlerMousedown = ($e: Event) => {
  const e = $e as MouseEvent
  // 判断是否是鼠标左键 与 只有 头部时才能移动 关闭等功能按下时不移动
  if (
    e.button !== 0 ||
    !(e.target as HTMLDivElement).className.includes("title")
  )
    return
  const wrap = containter.value as HTMLDivElement
  // 计算出活动的范围
  rangeX = document.documentElement.clientWidth - wrap.offsetWidth
  rangeY = document.documentElement.clientHeight - wrap.offsetHeight

  // 得到初始的鼠标位置
  curY = e.pageY
  curX = e.pageX
  //  container容器 初始的top和left值
  wrapTop = wrap.offsetTop
  wrapLeft = wrap.offsetLeft
  // 添加移动的事件监听
  window.addEventListener("mousemove", move)
  // 监听 window 的鼠标抬起事件
  window.addEventListener("mouseup", handlerMouseup)
}

// 鼠标 抬起
const handlerMouseup = ($e: Event) => {
  const e = $e as MouseEvent
  // 判断是否是鼠标左键
  if (e.button !== 0) return
  // 移除移动的事件监听
  window.removeEventListener("mousemove", move)
  window.removeEventListener("mouseup", handlerMouseup)
}
// 移动的回调
const move = ($e: Event) => {
  const e = $e as MouseEvent
  const tar = containter.value as HTMLDivElement
  // 当前位置 减去 鼠标按下的初始位置 加上 元素的初始位置 即是元素的移动距离
  let changeX = e.pageX - curX + wrapLeft
  let changeY = e.pageY - curY + wrapTop
  // 边界判断
  if (changeY < 0 || changeY > rangeY) {
    changeY = Math.max(0, Math.min(changeY, rangeY))
  }
  // 左右
  if (changeX < 0 || changeX > rangeX) {
    changeX = Math.max(0, Math.min(changeX, rangeX))
  }
  // 更具变量判断是否保存
  if (isPanelPositionSaved.value) {
    savedPanelLeft.value = `${changeX}`
    savedPanelTop.value = `${changeY}`
  }
  tar.style.left = changeX + "px"
  tar.style.top = changeY + "px"
}

// 监听 窗口变化事件
// 处理 窗口变化时的 边界超出问题
mitt.on("window:resize", open)

onBeforeUnmount(() => {
  // 移除移动的事件监听
  window.removeEventListener("mousemove", move)
  window.removeEventListener("mouseup", handlerMouseup)
  // 解除监控
  mitt.off("window:resize", open)
})
</script>

<style scoped lang="scss">
@use "sass:math";
$close-size: 20px;
$close-dur: v-bind(closeDur);
$close-color: v-bind(closeColor);
$close-color-hover: v-bind(closeColorHover);
$title-gap: 10px;
$title-hor: $title-gap;
$title-vert: 8px;
$mask: v-bind(mask);
$bg: v-bind(bg);
$title-bg: v-bind(titleBg);
$color: v-bind(color);
$title-color: v-bind(titleColor);
.dialog-wrapper {
  position: fixed;
  inset: 0;
  background-color: $mask;
  z-index: $my-dialog-index;
  .dialog-container {
    max-width: 100%;
    width: 700px;
    height: 80%;
    position: absolute;
    background-color: $bg;
    border-radius: 10px;
    overflow: hidden;
    color: $color;
    // 小屏
    @include media(500px, true) {
      height: 100%;
    }
    // 头部
    .title {
      display: flex;
      align-items: center;
      padding: $title-vert $title-hor;
      background-color: $title-bg;
      color: $title-color;
      position: relative;
      .btns {
        position: absolute;
        right: math.div($title-gap, 2);
        top: calc(25%);
        // 每个按钮项
        .btn-item {
          position: absolute;
          top: 0;
          right: 0;
          i {
            width: $close-size;
            height: $close-size;
            position: absolute;
            top: inherit;
            right: inherit;
          }
        }
        // 关闭按钮
        .close {
          transition: color $close-dur;
          color: $close-color;
          &:hover {
            color: $close-color-hover;
          }
        }
      }
    }
  }
}
</style>
