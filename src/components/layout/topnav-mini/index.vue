<template>
  <div class="header-menu-container">
    <div class="topnav">
      <a @click="isShow">
        <i class="i-ep:menu w-1em h-1em"> </i>
        菜单
      </a>
      <layout-setting
        width="150px"
        right="-10px"
        top="35px"
        :triangle="{ right: '15px' }"
      ></layout-setting>
    </div>
    <my-drawer
      v-model="drawer"
      width="250px"
      @close="handlerClose"
      bg="var(--header-drawer-bg)"
      mask="var(--header-drawer-mask)"
    >
      <!-- 
      @initRibbon="handlerRibbon"
     -->
      <template #body>
        <div class="container con">
          <!-- 头像 -->
          <img
            src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
            alt=""
            class="avater"
          />
          <div class="header-title">
            <router-link class="contain" to="">
              <div class="title">文章</div>
              <div class="content m-t-2px text-14px">7558</div>
            </router-link>
            <router-link class="contain" to="">
              <div class="title">标签</div>
              <div class="content m-t-2px text-14px">2464</div>
            </router-link>
            <router-link class="contain" to="">
              <div class="title">分类</div>
              <div class="content m-t-2px text-14px">35436</div>
            </router-link>
          </div>
          <Ribbon bg="var(--second-color)"></Ribbon>
          <layout-header-menu-mini :style></layout-header-menu-mini>
        </div>
      </template>
    </my-drawer>
  </div>
</template>
<script setup lang="ts">
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
  // 显示与隐藏
  @media screen and (max-width: $scr-sm) {
    display: flex;
  }
  display: none;
  .topnav {
    display: flex;
    &::v-deep(a) {
      @include flex(space-between);
      position: relative;
      margin-left: calc(var(--header-topnav-margin) - 7px);
      > i {
        margin-right: 3px;
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
    .header-title {
      display: flex;
      justify-content: space-between;
      margin-top: $gap;
      padding: 0 $header-title-pd;
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
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
