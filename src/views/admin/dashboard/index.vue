<template>
  <div class="admin-container">
    <my-card class="admin-content card_style" bg="var(--manager-card-bg) ">
      <div class="flex gap-20px">
        <!-- 取消居中 -->
        <global-avatar :isCenter="false"></global-avatar>
        <div class="flex flex-col justify-center gap-5px cur-text">
          <h1 class="m-0">Hi,下午好</h1>
          <span>{{ welcome }}</span>
        </div>
      </div>
    </my-card>
  </div>
</template>

<script setup lang="ts" name="AdminDashboard">
// 欢迎词
const welcome = import.meta.env.VITE_INITIAL_WELCOME
</script>
