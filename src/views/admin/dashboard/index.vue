<template>
  <div class="admin-container">
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div>AdminDashboard</div>
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminDashboard">
//
</script>

<style scoped lang="scss">
.admin-container {
  display: flex;
  flex-direction: column;
  gap: var(--admin-content-card-gap);
  @include adminHeaderBtns;
  .admin-content {
    padding: var(--admin-content-card-pd);
  }
}
</style>
