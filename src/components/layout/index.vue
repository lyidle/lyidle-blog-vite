<template>
  <layout-header />
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup lang="ts" name="Layout"></script>
<style scoped lang="scss"></style>
