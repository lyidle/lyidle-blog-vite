<template>
  <teleport to="body">
    <div class="drawer-mask" @click="close" v-show="drawer"></div>
    <transition name="drawer">
      <div class="drawer-content" v-show="drawer">
        <slot name="body"></slot>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts" name="Drawer">
const drawer = defineModel()
const close = (e: MouseEvent) => {
  if ((e.target as HTMLElement).className == "drawer") return
  drawer.value = false
}
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
  background-color: #0000005a;
  z-index: 10;
}
.drawer-content {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 35%;
  max-width: 300px;
  min-width: 200px;
  background-color: white;
  z-index: 11;
}
</style>
