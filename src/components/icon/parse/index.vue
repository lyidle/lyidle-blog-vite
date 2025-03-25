<template>
  <!-- 是data格式的背景么 -->
  <i
    v-if="parsedIcon(icon).name === 'bg'"
    class="icon-svg"
    :style="{
      '--svg': `url(${parsedIcon(icon).data})`,
    }"
    v-bind="$attrs"
  ></i>
  <!-- 是 svg 么 是就是svg 否则 i 加类名 -->
  <component
    v-else
    :is="(parsedIcon(icon).name === 'svg' && parsedIcon(icon).data) || 'i'"
    :class="parsedIcon(icon).name === 'class' ? parsedIcon(icon).data : ''"
    class="w-1em h-1em"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts" name="ParseIcon">
import { parsedIcon } from "@/utils/parseIcon"
// 接收icon
defineProps(["icon"])
</script>

<style scoped lang="scss">
svg {
  width: 1em;
  height: 1em;
}
.icon-svg {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
</style>
