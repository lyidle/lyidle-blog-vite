<template>
  <layout-content-aside-card @contextmenu="mitt.emit('isUserEditorMenu')">
    <template #body>
      <div class="aside-container aside-userinfo">
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
          class="pin right-pin cur-pointer"
          :content="'bin'"
          :style="{
            '--pin-left': '13px',
            '--pin-top': '15px',
          }"
          @click="userEditorScene"
          v-if="showIsBin"
        ></div>
        <div class="userInfo">
          <!-- 头像 -->
          <global-avatar></global-avatar>
        </div>
        <div class="text-[1.5625rem] flex flex-col gap-[5px] items-center">
          <global-name
            class="box-item"
            :account="showAccount"
            :nick="showNickName"
            nickClass="text-26px w-fit"
          ></global-name>
          <my-tooltip
            class="box-item"
            effect="dark"
            content="用户签名"
            placement="right-start"
          >
            <div class="w-fit line-clamp-1 cur-text text-center text-16px">
              {{ showSigner }}
            </div>
          </my-tooltip>
        </div>
        <div class="side-counts-container">
          <layout-link-pages></layout-link-pages>
        </div>
        <a
          href="https://github.com/lyidle/lyidle-blog-vite"
          class="block w-100% h-100%"
          target="_blank"
        >
          <my-button type="primary" class="userinfo-btn">
            <div class="tip">前往小窝</div>
            <div class="car">
              <icon-car></icon-car>
            </div>
          </my-button>
        </a>
        <div class="links">
          <a
            class="color-[var(--aside-userinfo-wechat-color)]"
            @click="
              copyToClipboardCallback({ type: '微信号', text: ownerWeChat })
            "
            v-if="ownerWeChat"
          >
            <i class="i-ic:twotone-wechat"></i>
          </a>
          <a
            class="color-[var(--aside-userinfo-qq-color)]"
            @click="copyToClipboardCallback({ type: 'QQ号', text: ownerQQ })"
            v-if="ownerQQ"
          >
            <icon-qq></icon-qq>
          </a>
          <a
            :href="ownerBiliBili"
            target="_blank"
            class="color-[var(--aside-userinfo-bilibili-color)]"
            v-if="ownerBiliBili"
          >
            <i class="i-simple-icons:bilibili"></i>
          </a>
          <a
            :href="`mailto:${ownerEmail}`"
            class="color-[var(--aside-userinfo-mail-color)]"
            target="_self"
            v-if="ownerEmail"
          >
            <i class="i-fluent-color:mail-24"></i>
          </a>
        </div>
      </div>
    </template>
  </layout-content-aside-card>
</template>

<script setup lang="ts" name="AsideIntroduceSelf">
// 引入仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
// 引入 处理后的数据
import { useShowUserinfo } from "@/hooks/showUserinfo"
// 引入 hooks
// 切换 到编辑用户界面
import { useUserEditorScene } from "@/hooks/useUserEditorScene"
import { mitt } from "@/utils/emitter"
// 引入 复制到 剪贴板 的函数
import { copyToClipboardCallback } from "@/hooks/context-menu/copyToClipboard"
// 切换 到编辑用户界面
const userEditorScene = useUserEditorScene()
// 提取需要展示的信息
const { showNickName, showSigner, showIsBin, showAccount } = useShowUserinfo({
  showNickName: true,
  showAccount: true,
  showSigner: true,
  showIsBin: true,
})

const {
  // 网站 所有者信息
  adminAccount,
  ownerWeChat,
  ownerQQ,
  ownerBiliBili,
  ownerEmail,
} = storeToRefs(useOwnerStore())
// 提取需要的数据
const {
  // 用户信息
  userToken,
} = storeToRefs(useUserStore())
</script>

<style scoped lang="scss">
$gap: 20px;
$userinfo-gap: 10px;
$links-gap: 10px;
$userinfo-btn-car-size: 25px;
.aside-container {
  all: unset;
  display: flex;
  flex-direction: column;
  gap: $gap;
  // 引入 card-pin 的样式
  @include card-pin;
  .userInfo {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: $userinfo-gap;
  }
  .side-counts-container {
    width: 100%;
    ::v-deep(.side-header-title) {
      margin-top: unset;
      padding: unset;
      justify-content: center;
      gap: 20px;
    }
  }
  .userinfo-btn {
    height: 35px;
    font-size: 1rem;
    border-radius: 20px;
    position: relative;
    .tip {
      position: absolute;
      left: 55px;
    }
    .car {
      width: 70px;
      height: $userinfo-btn-car-size;
      position: absolute;
      right: 20px;
      svg {
        position: absolute;
        width: $userinfo-btn-car-size;
        height: $userinfo-btn-car-size;
        top: 0;
        left: 0;
        animation: an-car infinite 2s linear;
      }
      // 小车移动动画
      @keyframes an-car {
        0% {
          left: 0;
          opacity: 0;
        }
        50% {
          left: calc(55% - $userinfo-btn-car-size);
          opacity: 1;
        }
        100% {
          left: calc(100% - $userinfo-btn-car-size);
          opacity: 0;
        }
      }
    }
  }
  .links {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: $links-gap;
    a {
      font-size: 1.4375rem;
      svg {
        width: 1.4375rem;
        height: 1.4375rem;
      }
      // 引入悬浮动画
      @include shake();
    }
  }
}
</style>
