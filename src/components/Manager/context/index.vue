<template>
  <div class="manager-context">
    <manager-header></manager-header>
    <div class="manager-content">
      <my-card class="card_style" bg="var(--manager-card-bg)">
        <slot></slot>
      </my-card>
    </div>
  </div>
</template>

<script setup lang="ts" name="ManagerContext">
//
</script>
<style scoped lang="scss"></style>
