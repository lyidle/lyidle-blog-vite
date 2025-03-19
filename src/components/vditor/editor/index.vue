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
// vditor 容器
const vditorEditor = ref()
const docHeight = defineModel<string>("docHeight")
const context = defineModel<string>("context")
const length = defineModel<number>("length")
const title = defineModel<string>("title")
const props = withDefaults(defineProps<{ isSaveBtn?: boolean }>(), {
  isSaveBtn: true,
})
// 使用 hooks
const vditor = useVditorEditor("vditor-editor", vditorEditor, {
  docHeight,
  context,
  length,
  title,
  isSaveBtn: props.isSaveBtn,
})

// 得到 内容
const getContext = () => {
  return vditor.value?.getValue()
}

defineExpose({ getContext })
// 使用 编辑器是否全屏的hook
useIsFullscreen(vditorEditor)
</script>

<style></style>
<style scoped lang="scss">
.my-vditor-container {
  // 提示信息
  $preview-h1-h6-tip-color: var(--editor-h1-h6-tip-color);
  $preview-h1-h6-tip-size: var(--editor-h1-h6-tip-size);
  // markdown 预览
  ::v-deep(.vditor-style) {
    $h2-ml: 0.625rem;
    // 恢复 编号的样式
    @for $i from 1 through 6 {
      h#{$i} {
        position: relative;
        &:before {
          content: "";
        }
      }
    }
    h1 {
      &::before {
        left: 53%;
        transform: translateX(-50%);
        position: absolute;
      }
    }

    // 提示的信息
    @for $i from 1 through 6 {
      h#{$i} {
        position: relative;
        &::after {
          $left: -4.0938rem;
          position: absolute;
          content: "H#{$i}";
          display: block;
          cursor: var(--cursor-default);
          @if $i == 2 {
            left: $left - $h2-ml;
          } @else {
            left: $left;
          }
          font-size: $preview-h1-h6-tip-size;
          color: $preview-h1-h6-tip-color;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>
