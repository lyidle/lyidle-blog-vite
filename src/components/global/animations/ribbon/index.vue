<template>
  <div class="ribbon-scissors">
    <div class="ribbon-container" ref="contain">
      <div class="i-tabler:scissors scissors"></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Ribbon">
const props = withDefaults(
  defineProps<{
    bg?: string
  }>(),
  {
    bg: "rgb(80, 145, 189)",
  }
)
const bg = props.bg
const contain = ref()
</script>

<style scoped lang="scss">
$underline-width: 5px;
$underline-height: 3px;
.ribbon-scissors {
  width: 100%;
  height: $scissors-size;
  display: flex;
  align-items: center;
  position: relative;
  > .ribbon-container {
    width: 100%;
    height: $underline-height;
    // 虚线
    background: linear-gradient(
        to right,
        v-bind(bg),
        v-bind(bg) $underline-width,
        transparent $underline-width,
        transparent
      )
      repeat-x;
    background-size: $underline-width * 2 100%;
    .scissors {
      width: $scissors-size;
      height: $scissors-size;
      color: v-bind(bg);
      position: absolute;
      top: 0;
      right: calc(100% - $scissors-size);
      transition: right 0.5s;
    }
  }
  &:hover .scissors {
    right: 0;
  }
}
</style>
