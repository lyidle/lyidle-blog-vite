<template>
  <div
    class="scroll-ornaments"
    :style="{
      height: `${scrollPercentage}vh`,
    }"
    v-if="isScrollOrnaments"
  >
    <div class="ornaments cur-pointer" @click="scrollTopCallback"></div>
  </div>
</template>

<script setup lang="ts" name="ScrollOrnaments">
// 引入仓库
import { useSettingStore } from "@/store/setting"
import { mitt } from "@/utils/emitter"
// 引入 回到顶部
import { scrollTop as scrollTopCallback } from "@/utils/toTopOrBottom"

const { scrollPercentage, isScrollOrnaments } = storeToRefs(useSettingStore())
const scrollTop = ref<number>(0) //滚动距离

// 计算滚动百分比
function getScrollPercentage(scrollTop: number) {
  const mathScroll = (scrollTop: number) => {
    // 可滚动总高度
    const scrollHeight = document.documentElement.scrollHeight
    const clientHeight = document.documentElement.clientHeight

    // 滚动百分比计算
    const scrollableHeight = scrollHeight - clientHeight
    const percentage = (scrollTop / scrollableHeight) * 100

    return Math.min(100, Math.max(0, Math.floor(percentage))) // 限制百分比范围在 0 到 100 之间
  }
  const result = mathScroll(scrollTop)

  // 处理初始化时的异常情况 确保值正常
  if (result >= 100) {
    return
  }

  if (result == 99) {
    scrollPercentage.value = 100
    return
  }

  scrollPercentage.value = result
}

// 滚动事件回调
const globalScroll = () => {
  // 当前滚动距离
  scrollTop.value = window.scrollY || document.documentElement.scrollTop
  // 计算滚动百分比
  getScrollPercentage(scrollTop.value)
}

onMounted(() => {
  // 监听滚动事件
  mitt.on("scroll", globalScroll)
})

onBeforeUnmount(() => {
  // 销毁监听滚动事件
  mitt.off("scroll", globalScroll)
})
</script>

<style scoped lang="scss">
$size: 50px;
$rope-size: 5px;
.scroll-ornaments {
  position: fixed;
  top: 0;
  right: 0;
  width: $size;
  z-index: $scroll-ornaments-index;
  overflow: hidden;
  &::before {
    display: block;
    content: "";
    position: absolute;
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
    bottom: $size - 5;
    width: $rope-size;
    height: 100vh;
    background-color: var(--scrollTop-rope-bg);
  }
  .ornaments {
    width: $size;
    height: $size;
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: 0;
    background: var(--scrollTop-bg) no-repeat;
    background-size: cover;
  }
}
</style>
