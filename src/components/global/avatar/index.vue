<template>
  <div class="avatar">
    <my-anchor
      :to="isTo ? `/user/space/${showAccount}` : ''"
      class="w-100% h-100% block"
      :style="{
        cursor: !isCursor ? 'unset!important' : 'var(--cursor-pointer)',
      }"
    >
      <img
        :style="{
          background: 'no-repeat center',
          backgroundSize: 'cover',
          backgroundImage: showAvatar,
        }"
        alt=""
        v-bind="$attrs"
        class="avatar w-100% h-100% block"
      />
    </my-anchor>
  </div>
</template>

<script setup lang="ts" name="Avatar">
// 引入 处理后的数据
import { useShowUserinfo } from "@/hooks/showUserinfo"
// 提取需要展示的信息
const { showAccount, showAvatar } = useShowUserinfo({
  showAccount: true,
  showAvatar: true,
})
withDefaults(
  defineProps<{ size?: string; isTo?: boolean; isCursor?: boolean }>(),
  {
    size: "100px",
    isTo: true,
    isCursor: true,
  }
)
</script>

<style scoped lang="scss">
$avater-size: v-bind(size);
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
