<template>
  <my-card class="content">
    <template #body>
      <div class="content-header">
        <slot name="poster"></slot>
        <div class="mask">
          <div class="poster-container line-clamp-2">
            『<slot name="description"></slot>』
          </div>
          <div class="pin">
            <i class="i-mynaui:pin-solid"></i>
          </div>
        </div>
      </div>
      <div class="content-info">
        <div class="title line-clamp-2">
          <slot name="title"></slot>
        </div>
        <div class="meta-contain">
          <div class="info-meta">
            <div class="item text">
              <i class="i-oui:token-date font-size-17px"></i>
              <slot name="publish"></slot>
            </div>
            <div class="item text">
              <i class="i-mingcute:refresh-3-line font-size-15px mr-1px" />
              <slot name="update"></slot>
            </div>
          </div>
          <div class="info-meta">
            <div class="item">
              <router-link :to="category.to">
                <div class="item">
                  <i class="i-tabler:clover-filled font-size-14px mr-2px" />
                  <span class="max-w-110px line-clamp-1">
                    {{ category.content }}
                  </span>
                </div>
              </router-link>
            </div>
            <div class="item">
              <router-link :to="label.to">
                <div class="item">
                  <i class="i-mynaui:label-solid font-size-14px mr-2px" />
                  <span class="max-w-110px line-clamp-1">
                    {{ label.content }}
                  </span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </my-card>
</template>

<script setup lang="ts" name="ContentCard">
interface dataType {
  to: string
  content: string
}
defineProps<{ category: dataType; label: dataType }>()
</script>

<style scoped lang="scss">
// 高度
$content-height: 350px;
$header-height: 200px;
// 底部信息高度
$content-info-height: $content-height - $header-height;
$title-m-t: 35px;
$title-m-b: 10px;
// 底部源信息 距离
$meta-gap: 5px;
.content {
  height: $content-height;
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: var(--pages-card-radius);
  overflow: hidden;
  // 头部
  .content-header {
    position: relative;
    overflow: hidden;
    height: $header-height;
    // 头部遮罩 图片
    .mask {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      pointer-events: none;
      background-image: var(--content-mask);
      font-size: 1rem;
      color: white;
      // 置顶
      .pin {
        position: absolute;
        top: 0;
        left: 0;
        width: 30px;
        height: 30px;
        background-color: var(--content-card-pin-bg);
        clip-path: polygon(0 0, 0% 100%, 100% 0);
        i {
          position: absolute;
          top: 1px;
          left: 2px;
          color: var(--content-card-pin-color);
        }
      }
      .poster-container {
        $height: 80px;
        width: 70%;
        height: $height;
        text-align: center;
        line-height: calc($height / 2);
        font-size: 1rem;
        overflow: hidden;
        inset: 0;
        margin: auto;
        position: absolute;
      }
    }
  }
  // 卡片底部内容
  .content-info {
    height: $content-info-height;
    position: relative;
    // 副标题
    .title {
      font-size: 1.1875rem;
      font-weight: 600;
      text-align: center;
      margin-top: $title-m-t;
      margin-bottom: $title-m-b;
      padding: 0 20px;
      overflow: hidden;
    }
    // 源信息
    .info-meta {
      font-size: 0.8125rem;
      display: flex;
      justify-content: center;
      &:not(:last-child) {
        margin-bottom: $meta-gap;
      }
      .item {
        display: flex;
        align-items: center;
        a {
          @include pages-links-hover;
        }
        // 除了最后的都有竖着的分割线
        &:not(:last-child) {
          border-right: 1px solid var(--primary-color);
        }
        // 选中奇数odd 设置 右边框
        &:nth-child(2n-1) {
          padding-right: 3px;
        }
        // 选中偶数even 设置 左边框
        &:nth-child(2n) {
          padding-left: 3px;
        }
      }
    }
  }
}
</style>
