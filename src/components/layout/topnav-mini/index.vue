<template>
  <div class="header-menu-container">
    <ul class="topnav">
      <li>
        <router-link to="/home">
          <i class="i-ep:home-filled w-1em h-1em"> </i>
          首页
        </router-link>
      </li>
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
        <div class="top-avater-container">
          <div class="pin" content="admin" v-if="!userAccount"></div>
          <!-- 头像 -->
          <router-link :to="`/space/${userAccount || adminAccount}`">
            <img
              :style="{
                background: 'no-repeat center',
                backgroundSize: 'cover',
                backgroundImage:
                  userAvatar ||
                  (userAccount
                    ? 'var(--default-avater)'
                    : adminAvatar || 'var(--default-avater)'),
              }"
              alt=""
              class="avater"
            />
          </router-link>
          <layout-link-pages></layout-link-pages>
          <Ribbon bg="var(--header-color)"></Ribbon>
          <layout-header-menu-mini :style></layout-header-menu-mini>
        </div>
      </template>
    </my-drawer>
  </div>
</template>
<script setup lang="ts">
// 引入仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
// 引入自定义 函数
import debounce from "@/utils/debounce"
const {
  // 用户信息
  userAccount,
  userAvatar,
} = storeToRefs(useUserStore())
const {
  // 管理员信息 用于展示没登陆的默认信息
  adminAccount,
  adminAvatar,
} = storeToRefs(useOwnerStore())
const drawer = ref(false)
const resizeCb = debounce(() => {
  // src/styles/variable.scss 的变量 sm 的值
  if (document.documentElement.offsetWidth > 992) {
    // 显示 滚动条
    document.documentElement.style.overflow = "unset"
  } else {
    // 隐藏 html 的滚动条
    document.documentElement.style.overflow = "hidden"
  }
}, 200)
// 展示drawer
const isShow = () => {
  // 隐藏 html 的滚动条
  document.documentElement.style.overflow = "hidden"
  drawer.value = true
  window.addEventListener("resize", resizeCb)
}
// 关闭drawer
const handlerClose = () => {
  // 打开 html 的滚动条
  document.documentElement.style.overflow = "unset"
  window.removeEventListener("resize", resizeCb)
}

onUnmounted(() => {
  window.addEventListener("resize", resizeCb)
})
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
  @include media(sm) {
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
  .top-avater-container {
    $gap: 15px;
    color: var(--header-drawer-title-color);
    box-sizing: border-box;
    position: relative;
    .pin {
      position: absolute;
      top: 0;
      left: 0;
      width: 2.5rem;
      height: 5rem;
      background-color: var(--content-card-pin-bg);
      clip-path: polygon(0 0, 0% 100%, 100% 0);
      color: var(--content-card-pin-color);
      &::before {
        content: attr(content);
        display: block;
        position: absolute;
        transform: rotate(295deg);
        left: -0.5rem;
        top: 0.9375rem;
      }
    }

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
