<template>
  <div class="avatar">
    <my-anchor
      :to="isTo ? `/user/space/${showAccount}` : ''"
      class="w-100% h-100% block"
      :style="{
        cursor: !isCursor ? 'unset!important' : 'var(--cursor-pointer)',
      }"
    >
      <div
        :style="{
          background: 'no-repeat center',
          backgroundSize: 'contain',
          backgroundImage: imgSrc || showAvatar,
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
const props = withDefaults(
  defineProps<{
    isTo?: boolean
    isCursor?: boolean
    isCenter?: boolean
    imgSrc?: string
  }>(),
  {
    isTo: true,
    isCursor: true,
    isCenter: true,
  }
)
const left = props.isCenter ? "50%" : "initial"
const transform = props.isCenter ? "translateX(-50%)" : "initial"
</script>

<style scoped lang="scss">
.avatar {
  --avatar-size: 100px;
  width: var(--avatar-size);
  height: var(--avatar-size);
  border-radius: 50%;
  position: relative;
  left: v-bind(left);
  transform: v-bind(transform);
  overflow: hidden;
}
</style>
