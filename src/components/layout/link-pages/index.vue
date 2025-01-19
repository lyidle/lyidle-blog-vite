<template>
  <div class="side-header-title">
    <router-link class="contain" :to="`/user/doc/${showAccount}`">
      <div class="title">文章</div>
      <div class="content text-14px">
        {{ showPages || 0 }}
      </div>
    </router-link>
    <router-link class="contain" :to="`/user/tags/${showTags}`">
      <div class="title">标签</div>
      <div class="content text-14px">
        {{ showCategories || 0 }}
      </div>
    </router-link>
    <router-link class="contain" :to="`/user/categories/${showAccount}`">
      <div class="title">分类</div>
      <div class="content text-14px">
        {{ showCategories || 0 }}
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts" name="LinkPages">
// 引入 处理后的数据
import { useShowUserinfo } from "@/hooks/showUserinfo"
// 提取需要展示的信息
const { showAccount, showPages, showTags, showCategories } = useShowUserinfo()
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
