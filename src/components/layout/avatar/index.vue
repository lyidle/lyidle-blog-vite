<template>
  <div class="avatar">
    <router-link :to="`/user/space/${showAccount}`" class="w-100% h-100% block">
      <img
        :style="{
          background: 'no-repeat center',
          backgroundSize: 'cover',
          backgroundImage: showAvatar,
        }"
        alt=""
        class="avatar w-100% h-100% block"
      />
    </router-link>
  </div>
</template>

<script setup lang="ts" name="Avatar">
// 引入 处理后的数据
import { useShowUserinfo } from "@/hooks/showUserinfo"

// 提取需要展示的信息
const { showAccount, showAvatar } = useShowUserinfo()
</script>

<style scoped lang="scss">
$avater-size: 110px;
.avatar {
  width: $avater-size;
  height: $avater-size;
  border-radius: 50%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
}
</style>
