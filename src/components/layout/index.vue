<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.path" />
  </router-view>
</template>

<script setup lang="ts" name="Layout">
//
</script>
<style scoped lang="scss"></style>
