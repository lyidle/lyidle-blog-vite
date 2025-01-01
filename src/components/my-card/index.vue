<template>
  <div class="myCard body">
    <slot name="body"></slot>
  </div>
</template>

<script setup lang="ts" name="Card">
const props = withDefaults(defineProps<{ bg?: string }>(), {
  bg: "white",
})
const bg = props.bg
</script>

<style scoped lang="scss">
// 高度
// $card-height: 350px;
.myCard {
  // height: $card-height;
  background-color: v-bind(bg);
  border-radius: 10px;
  overflow: hidden;
  color: #2a4f7c;
  @include useTheme {
    box-shadow: getvar(primary-shadow);
  }
}
</style>
