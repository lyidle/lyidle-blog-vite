<template>
  <div class="header-menu-container">
    <ul class="topnav">
      <layout-header-normal :menuStyle>
        <template #last>
          <!-- 菜单项 -->
          <li>
            <a @click="isShow" class="item-a">
              <i class="i-ep:menu w-1em h-1em"> </i>
              菜单
            </a>
          </li>
        </template>
      </layout-header-normal>
    </ul>
    <my-drawer
      v-model="drawer"
      width="250px"
      @close="handlerClose"
      name="mini-header-drawer"
    >
      <template #body>
        <div class="top-avater-container">
          <div>
            <div
              class="pin"
              :content="adminAccount ? `admin` : 'null'"
              :style="{
                '--pin-left': adminAccount ? '-0.5rem' : '0rem',
                '--pin-top': adminAccount ? '0.9375rem' : '0.9375rem',
              }"
              v-if="!userToken"
            ></div>
            <!-- 头像 -->
            <router-link
              :to="`/space/${(userToken && userAccount) || adminAccount}`"
            >
              <img
                :style="{
                  background: 'no-repeat center',
                  backgroundSize: 'cover',
                  backgroundImage:
                    (userToken && userAvatar) ||
                    (userToken && userAccount
                      ? 'var(--default-avatar)'
                      : adminAvatar || 'var(--default-avatar)'),
                }"
                alt=""
                class="avatar"
              />
            </router-link>
          </div>
          <layout-link-pages></layout-link-pages>
          <Ribbon bg="var(--scissors-color)"></Ribbon>
          <layout-header-topnav-mini-generate
            :style
          ></layout-header-topnav-mini-generate>
        </div>
      </template>
    </my-drawer>
  </div>
</template>
<script setup lang="ts">
// 引入仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"

// 接收props
defineProps<{ menuStyle?: menuStyleType }>()

// 提取需要的信息
const {
  // 用户信息
  userToken,
  userAccount,
  userAvatar,
} = storeToRefs(useUserStore())
const {
  // 管理员信息 用于展示没登陆的默认信息
  adminAccount,
  adminAvatar,
} = storeToRefs(useOwnerStore())
const drawer = ref(false)
// 展示drawer
const isShow = () => {
  // 隐藏 html 的滚动条
  document.documentElement.style.overflow = "hidden"
  drawer.value = true
}

// 关闭drawer
const handlerClose = () => {
  // 打开 html 的滚动条
  document.documentElement.style.overflow = "unset"
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
.header-menu-container {
  position: relative;
  height: 100%;
  display: none;
  @include media(sm) {
    display: block;
  }
  .topnav {
    height: 100%;
    display: none;
    @include media(sm) {
      display: flex;
    }
  }
}
</style>

<!-- drawer  -->
<style lang="scss">
$header-title-pd: 30px;
$header-content-pd: 20px;
.mini-header-drawer {
  // 设置drawer 的层级
  .drawer-mask {
    z-index: $header-mini-drawer-mask-index;
    background-color: var(--header-drawer-mask);
  }
  .drawer-content {
    z-index: $header-mini-drawer-mask-index + 1;
    background-color: var(--header-drawer-bg);
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
      background-color: var(--mini-drawer-pin-bg);
      clip-path: polygon(0 0, 0% 100%, 100% 0);
      color: var(--mini-drawer-pin-color);
      &::before {
        content: attr(content);
        display: block;
        position: absolute;
        transform: rotate(295deg);
        top: var(--pin-top, 0);
        left: var(--pin-left, 0);
      }
    }

    .avatar {
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
    .ribbon-scissors {
      margin: $gap 0;
    }
    .contain.menu {
      padding: 0 $header-content-pd;
    }
  }
}
</style>
