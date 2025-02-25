<template>
  <router-link :to v-if="to" v-bind="$attrs">
    <slot></slot>
  </router-link>
  <a v-else v-bind="$attrs"><slot></slot></a>
</template>

<script setup lang="ts" name="MyAnchor">
defineProps(["to"])
</script>

<style scoped></style>
