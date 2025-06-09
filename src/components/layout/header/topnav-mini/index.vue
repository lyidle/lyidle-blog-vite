<template>
  <div class="header-menu-container">
    <ul class="topnav">
      <layout-header-normal>
        <template #last-scend>
          <!-- 菜单项 -->
          <li>
            <a @click="isShow" class="item-a">
              <i class="i-ep:menu w-1em h-1em" v-if="isNavIcon"> </i>
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
        <div class="mini-nav-avater-container">
          <div
            class="pin"
            :content="adminAccount ? `owner` : 'null'"
            :style="{
              '--pin-left': adminAccount ? '-0.5rem' : '0rem',
              '--pin-top': adminAccount ? '1.125rem' : '0.9375rem',
            }"
            v-if="!userToken"
          ></div>
          <div
            class="pin right-pin"
            :content="'bin'"
            :style="{
              '--pin-left': '13px',
              '--pin-top': '15px',
            }"
            @click="userEditorScene"
            v-if="showIsBin"
          ></div>
          <!-- 头像 -->
          <global-avatar></global-avatar>
          <layout-link-pages></layout-link-pages>
          <global-animations-ribbon
            bg="var(--scissors-color)"
          ></global-animations-ribbon>
          <my-menu-accordion :data="userMenuList"></my-menu-accordion>
        </div>
      </template>
    </my-drawer>
  </div>
</template>
<script setup lang="ts" name="TopNavMini">
// 引入仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
import { useSettingStore } from "@/store/setting"

// 引入 处理后的数据
import { useShowUserinfo } from "@/hooks/showUserinfo"
import { mitt } from "@/utils/emitter"
// 引入 hooks
import { useUserEditorScene } from "@/hooks/useUserEditorScene"
// 切换 到编辑用户界面
const userEditorScene = useUserEditorScene()
// 提取需要展示的信息
const { showIsBin } = useShowUserinfo({
  showIsBin: true,
})

// 提取需要的数据
const { isNavIcon } = storeToRefs(useSettingStore())
const {
  // 用户信息
  userToken,
  userMenuList,
} = storeToRefs(useUserStore())

const {
  // 管理员信息 用于展示没登陆的默认信息
  adminAccount,
} = storeToRefs(useOwnerStore())
const drawer = ref(false)
// 展示drawer
const isShow = () => {
  // 隐藏 html 的滚动条
  drawer.value = true
  document.documentElement.style.overflow = "hidden"
}
// 关闭drawer
const handlerClose = () => {
  // 打开 html 的滚动条
  drawer.value = false
  document.documentElement.style.overflow = ""
}

// 监听 路由的变化
mitt.on("router changed", handlerClose)

onBeforeUnmount(() => {
  // 取消监听 路由的变化
  mitt.off("router changed", handlerClose)
})
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
    z-index: $my-drawer-content;
    background-color: var(--drawer-mask);
  }
  .drawer-content {
    z-index: $my-drawer-content + 1;
    background-color: var(--drawer-bg);
  }
  .mini-nav-avater-container {
    $gap: 15px;
    color: var(--header-drawer-title-color);
    box-sizing: border-box;
    position: relative;
    // 引入 card-pin 的样式
    @include card-pin;
    .avatar {
      width: 100px;
      height: 100px;
      clip-path: ellipse();
      // 居中
      position: relative;
      left: 50%;
      transform: translateX(-50%);
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
