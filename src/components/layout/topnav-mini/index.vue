<template>
  <div class="menu">
    <i class="i-ep:menu w-1em h-1em" @click="isShow"></i>
    <my-drawer v-model="drawer">
      <template #body>31313</template>
    </my-drawer>
  </div>
</template>
<script setup lang="ts">
const props = defineProps(["menuList"])
const headerColor = defineModel("headerColor")
const drawer = ref(false)
const isShow = () => {
  drawer.value = true
}
</script>

<style scoped lang="scss">
.menu {
  @media screen and (max-width: $scr-sm) {
    display: flex;
  }
  display: none;
  > i {
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
