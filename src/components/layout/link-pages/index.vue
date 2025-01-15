<template>
  <div class="side-header-title">
    <router-link
      class="contain"
      :to="`/user/doc/${userAccount || adminAccount}`"
    >
      <div class="title">文章</div>
      <div class="content text-14px">
        {{ userAccount ? userPages : adminPages }}
      </div>
    </router-link>
    <router-link
      class="contain"
      :to="`/user/tags/${userAccount || adminAccount}`"
    >
      <div class="title">标签</div>
      <div class="content text-14px">
        {{ userAccount ? userTags : adminTags }}
      </div>
    </router-link>
    <router-link
      class="contain"
      :to="`/user/categories/${userAccount || adminAccount}`"
    >
      <div class="title">分类</div>
      <div class="content text-14px">
        {{ userAccount ? userCategories : adminCategories }}
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts" name="LinkPages">
// 引入仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
// 提取需要的数据
const {
  // 用户信息
  userAccount,
  userPages,
  userTags,
  userCategories,
} = storeToRefs(useUserStore())
const {
  // 管理员信息 用于展示没登陆的默认信息
  adminAccount,
  adminPages,
  adminTags,
  adminCategories,
} = storeToRefs(useOwnerStore())
</script>

<style scoped lang="scss">
.side-header-title {
  $gap: 15px;
  $header-title-pd: 30px;
  display: flex;
  justify-content: space-between;
  margin-top: $gap;
  padding: 0 $header-title-pd;
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    @include pages-links-hover;
  }
  .contain {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
}
</style>
