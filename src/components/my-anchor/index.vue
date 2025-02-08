<template>
  <router-link :to v-if="to">
    <slot></slot>
  </router-link>
  <a v-else><slot></slot></a>
</template>

<script setup lang="ts" name="MyAnchor">
defineProps(["to"])
</script>

<style scoped></style>
