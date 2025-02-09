<template>
  <div class="myCard body">
    <slot></slot>
  </div>
</template>

<script setup lang="ts" name="MyCard">
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
  // color: #2a4f7c;
  box-shadow: -5px 5px 10px rgba(180, 203, 225, 0.5);
}
</style>
