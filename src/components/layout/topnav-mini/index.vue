<template>
  <div class="menu">
    <el-icon class="i-ep:menu" @click="isShow"></el-icon>
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
