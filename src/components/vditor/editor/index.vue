<template>
  <div class="my-vditor-container">
    <div id="vditor-editor" class="vditor-style" ref="vditorEditor"></div>
  </div>
</template>

<script setup lang="ts" name="VditorEditor">
// 引入 编辑器的 hooks
import { useVditorEditor } from "@/hooks/Doc/vditorEditor"

// 引入 编辑器 全屏事件的 处理 hooks
import { useIsFullscreen } from "@/hooks/Doc/vditorEditor/isFullScreen"

onMounted(() => {
  // @ts-ignore
  const styles = document.querySelector("style[data-v-5e96d17d]")?.innerText
  console.log(styles)
})
// vditor 容器
const vditorEditor = ref()
const docHeight = defineModel<string>("docHeight")
const context = defineModel<string>("context")
const length = defineModel<number>("length")
// 使用 hooks
const vditor = useVditorEditor("vditor-editor", vditorEditor, {
  docHeight,
  context,
  length,
})

// 得到 内容
const getContext = () => {
  return vditor.value?.getValue()
}

defineExpose({ getContext })
// 使用 编辑器是否全屏的hook
useIsFullscreen(vditorEditor)
</script>
