<template>
  <layout-content-aside-card class="aside-container" v-if="pages">
    <template #title>
      <i class="i-mdi:recent"></i>
      <span>最新文章</span>
    </template>
    <template #body>
      <div class="item" v-for="item in pages" :key="item.id">
        <template v-if="item.id">
          <div class="poster">
            <router-link :to="`/doc/${item.id}`">
              <div
                :style="{
                  background: 'no-repeat center',
                  backgroundSize: 'cover',
                  // 转义url链接
                  backgroundImage: item.poster
                    ? `url('${escapeUrlForRegExp(item.poster)}')`
                    : 'var(--default-img)',
                }"
                class="poster-img"
              />
              <div class="mask"></div>
            </router-link>
          </div>
          <div class="content">
            <div class="title line-clamp-2 route-link">
              <router-link :to="`/doc/${item.id}`">
                {{ item.title }}
              </router-link>
            </div>
            <div class="date cur-text">{{ moment(item.updatedAt) }}</div>
          </div>
        </template>
      </div>
    </template>
  </layout-content-aside-card>
</template>

<script setup lang="ts" name="AsideRecentPages">
import moment from "@/utils/moment"
import { getRecentPages } from "@/api/article"
import type { GetRecentPages } from "@/api/article/types/getRecentPages"
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"

// 最新文章
//  展示的数据
const pages = ref<GetRecentPages["data"] | null>()
// 发起请求
const reqRecentPages = async () => {
  try {
    const result = await getRecentPages()
    result ? (pages.value = result) : undefined
  } catch (error) {}
}

// 初始化 发起请求
onMounted(async () => {
  await reqRecentPages()
})
</script>

<style scoped lang="scss">
// 内容中的每一项的上下间距
$item-gap: 10px;
$poster-radius: var(--pages-card-radius);
// 内容的标题与时间的间距
$content-gap: 10px;
// 底部poster与content的间距
$container-gap: $content-gap;
.aside-container {
  @include content-aside-title(var(--aside-title-icon-bg));
  ::v-deep(.body) {
    display: flex;
    flex-direction: column;
    gap: $item-gap;
    .item {
      display: flex;
      justify-content: space-between;
      .poster {
        width: 65px;
        height: 65px;
        overflow: hidden;
        border-radius: $poster-radius;
        position: relative;
        .poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--primary-during);
        }
        .mask {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-image: var(--content-mask);
        }
      }
      &:hover .poster .poster-img {
        transform: scale($pages-poster-scale);
      }
      > .content {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: $content-gap;
        margin-left: $container-gap;
        .title {
          font-size: 0.875rem;
        }
        .date {
          font-size: 0.8125rem;
        }
      }
    }
  }
}
</style>
