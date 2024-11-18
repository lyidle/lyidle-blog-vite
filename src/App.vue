<template>
  <layout></layout>
</template>

<script setup lang="ts" name="App">
// 离开窗口和回来的提示标题
function setTitleTip() {
  // 设置标题离开和回来的提示语
  let temp: string
  let tipFlag = JSON.parse(import.meta.env.VITE_TITLE_TIP_SHOW) || true
  const leaveTip = import.meta.env.VITE_LEAVE_TITLE_TIP || "不要离开~"
  const enterTip = import.meta.env.VITE_ENTER_TITLE_TIP || "欢迎回来"
  const tipDuring = +import.meta.env.VITE_TITLE_TIP_DURING || 1
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
onMounted(() => {
  setTitleTip()
})
</script>

<style scoped></style>
