<template>
  <div class="header-menu-container">
    <ul class="topnav">
      <li>
        <a @click="isShow">
          <i class="i-ep:menu w-1em h-1em"> </i>
          菜单
        </a>
      </li>
      <li>
        <layout-setting
          right="-10px"
          top="50px"
          :triangle="{ right: '15px' }"
        ></layout-setting>
      </li>
    </ul>
    <my-drawer
      v-model="drawer"
      width="250px"
      @close="handlerClose"
      bg="var(--header-drawer-bg)"
      mask="var(--header-drawer-mask)"
    >
      <template #body>
        <div class="container con">
          <!-- 头像 -->
          <img :src="userInfo.avater" alt="" class="avater" />
          <layout-link-pages></layout-link-pages>
          <Ribbon bg="var(--second-color)"></Ribbon>
          <layout-header-menu-mini :style></layout-header-menu-mini>
        </div>
      </template>
    </my-drawer>
  </div>
</template>
<script setup lang="ts">
// 引入仓库
import { useUserStore } from "@/store/user"
const { userInfo } = storeToRefs(useUserStore())
const drawer = ref(false)
// 展示drawer
const isShow = () => {
  // 隐藏 html 的滚动条
  document.documentElement.style.overflowY = "hidden"
  drawer.value = true
}
// 关闭drawer
const handlerClose = () => {
  // 打开 html 的滚动条
  document.documentElement.style.overflowY = "scroll"
}
const style = {
  icon: { plus: "i-ic:baseline-plus", minus: "i-ic:baseline-minus" },
  titleBg: "var(--header-mini-title-bg)",
  titleBgHover: "var(--header-mini-title-bg-hover)",
  titleColor: "var(--header-mini-title-color)",
  titleColorHover: "var(--header-mini-title-color-hover)",
  subtitleBg: "var(--header-mini-subtitle-bg)",
  subtitleBgHover: "var(--header-mini-subtitle-bg-hover)",
  subtitleColor: "var(--header-mini-subtitle-color)",
  subtitleColorHover: "var(--header-mini-subtitle-color-hover)",
}
</script>

<style scoped lang="scss">
$header-title-pd: 30px;
$header-content-pd: 20px;
.header-menu-container {
  position: relative;
  height: 100%;
  display: none;
  // 显示与隐藏
  @media screen and (max-width: $scr-sm) {
    display: flex;
  }
  .topnav {
    display: flex;
    height: 100%;
    &::v-deep(a) {
      @include flex(space-between);
      position: relative;
      height: 100%;
      margin-left: calc(var(--header-topnav-margin) - 7px);
      > i {
        margin-right: 3px;
      }
      // 导航下划线
      &::before {
        content: "";
        display: block;
        width: 0;
        height: var(--header-topnav-mask-height);
        background-color: var(--header-topnav-mask-color);
        position: absolute;
        bottom: 5px;
        transition: 0.3s;
      }
      &:hover:before {
        width: 100%;
      }
    }
  }
  .container.con {
    $gap: 15px;
    color: var(--header-drawer-title-color);
    box-sizing: border-box;
    position: relative;
    .avater {
      width: 100px;
      height: 100px;
      clip-path: ellipse();
      // 居中
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      //顶部距离
      margin-top: $gap;
    }
    // 虚线
    ::v-deep(.ribbon-scissors) {
      margin: $gap 0;
    }
    ::v-deep(.contain.menu) {
      padding: 0 $header-content-pd;
    }
  }
}
</style>
