<template>
  <my-card class="content">
    <template #body>
      <div class="content-header">
        <img src="/static/images/base-bg-light.png" alt="" class="img" />
        <div class="mask size-16px color-white">
          <div
            class="inset-0 m-auto absolute w-70% h-80px text-center leading-40px font-size-16px"
          >
            『<slot name="description"></slot>』
          </div>
        </div>
      </div>
      <div class="content-info">
        <div class="title"><slot name="title"></slot></div>
        <div class="meta-contain">
          <div class="info-meta">
            <div class="publish">
              <i class="i-oui:token-date w-1em h-1em translate-y-3px"></i>
              <span class="ml-3px mr-3px"><slot name="publish"></slot></span>
            </div>
            |
            <div class="ml-3px update">
              <i
                class="i-mingcute:refresh-3-line w-1em h-1em translate-y-2px"
              />
              <span class="ml-3px"><slot name="update"></slot></span>
            </div>
          </div>
          <div class="info-meta">
            <div class="category">
              <i class="i-tabler:clover-filled w-1em h-1em translate-y-3px"></i>
              <span class="ml-3px mr-3px"><slot name="category"></slot></span>
            </div>
            |
            <div class="ml-3px label">
              <i
                class="i-mynaui:label-solid w-1em h-1em w-1em h-1em translate-y-2px"
              />
              <span class="ml-3px"><slot name="label"></slot></span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </my-card>
</template>

<script setup lang="ts" name="ContentCard">
//
</script>

<style scoped lang="scss">
// 内容的背景
$content-bg: var(--content-card-bg);
// 高度
$content-height: 350px;
$header-height: 200px;
// 底部信息高度
$content-info-height: $content-height - $header-height;
$title-m-t: 45px;
$title-m-b: 10px;
// 底部源信息 距离
$meta-gap: 5px;
.content {
  user-select: none;
  height: $content-height;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: $content-bg;
  border-radius: 10px;
  overflow: hidden;
  color: var(--primary-color);
  box-shadow: var(--content-shadow);
  transition: transform var(--primary-during);
  &:hover {
    transform: translateY(-10px);
  }
  // 头部
  .content-header {
    position: relative;
    overflow: hidden;
    height: $header-height;
    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: var(--primary-during) transform;
      &:hover {
        transform: scale(1.1);
      }
    }
    // 头部遮罩 图片
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      pointer-events: none;
      background-image: var(--content-mask);
    }
  }
  // 卡片底部内容
  .content-info {
    height: $content-info-height;
    position: relative;
    // 副标题
    .title {
      font-size: 19px;
      font-weight: 600;
      text-align: center;
      overflow: hidden;
      margin-top: $title-m-t;
      margin-bottom: $title-m-b;
    }
    // 源信息
    .info-meta {
      font-size: 13px;
      display: flex;
      justify-content: center;
      inset: 0;
      margin: auto;
      &:not(:last-child) {
        margin-bottom: $meta-gap;
      }
    }
  }
}
</style>
