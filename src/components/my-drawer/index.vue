<template>
  <div>
    <div class="drawer-mask" @click="close" v-if="drawer"></div>
    <transition name="drawer">
      <div class="drawer-content" v-if="drawer">
        <slot name="body"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts" name="MyDrawer">
const drawer = defineModel()
const emits = defineEmits<{
  close: []
}>()
const close = (e: MouseEvent) => {
  if ((e.target as HTMLElement).className == "drawer") return
  drawer.value = false
  emits("close")
}
withDefaults(defineProps<{ width?: string; bg?: string; mask?: string }>(), {
  width: "250px",
  bg: "white",
  mask: "#0000005a",
})
</script>

<style scoped lang="scss">
$drawer-during: 0.3s;
.drawer-enter-active {
  transform: translateX(0);
  transition: transform $drawer-during;
}
.drawer-leave-active {
  transform: translateX(0);
  transition: transform $drawer-during;
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}
.drawer-mask {
  position: fixed;
  inset: 0;
  background-color: v-bind(mask);
  z-index: $my-drawer-mask-index;
}
.drawer-content {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: v-bind(width);
  background-color: v-bind(bg);
  z-index: $my-drawer-mask-index + 1;
  overflow-y: scroll;
}
</style>
