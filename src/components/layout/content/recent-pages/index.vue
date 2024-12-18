<template>
  <layout-content-aside-card class="aside-container">
    <template #title>
      <i class="i-mdi:recent"></i>
      <span>最新文章</span>
    </template>
    <template #body>
      <div class="item" v-for="item in 4">
        <router-link to="">
          <div class="poster">
            <img src="@/assets/images/base-bg-light.png" alt="" />
            <div class="mask"></div>
          </div>
        </router-link>
        <div class="content">
          <router-link to="">
            <div class="title line-clamp-2">
              Linux系统移植篇(三)——根 文件系统的构建 文件系统的构建
              文件系统的构建 文件系统的构建
            </div>
          </router-link>
          <div class="date text">2023-04-01</div>
        </div>
      </div>
    </template>
  </layout-content-aside-card>
</template>

<script setup lang="ts" name="WebInfo">
//
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
  @include content-aside-title(var(--aside-recent-pg-icon-bg));
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
        img {
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
      &:hover .poster img {
        transform: scale($recent-poster-scale);
      }
      .content {
        flex: 1 1 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: $content-gap;
        margin-left: $container-gap;
        .title {
          font-size: 0.875rem;
          @include pages-links-hover;
        }
        .date {
          font-size: 0.8125rem;
        }
      }
    }
  }
}
</style>
