<template>
  <context-menu>
    <layout-content-aside-card>
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
          <div class="userInfo">
            <!-- 头像 -->
            <global-avatar></global-avatar>
          </div>
          <div class="username font-size-1.5625rem text-center cur-text">
            {{ showNickName }}
            <div class="signer text-center cur-text">
              {{ showSigner }}
            </div>
          </div>
          <div class="side-counts-container">
            <layout-link-pages></layout-link-pages>
          </div>
          <router-link
            class="block w-100% h-100%"
            :to="`/user/space/${adminAccount}`"
          >
            <my-button type="primary" class="userinfo-btn">
              <div class="tip">前往小窝</div>
              <div class="car">
                <icon-car></icon-car>
              </div>
            </my-button>
          </router-link>
          <div class="links">
            <a
              class="color-[var(--aside-userinfo-wechat-color)]"
              @click="copyToClipboard('微信号', ownerWeChat)"
              v-if="ownerWeChat"
            >
              <i class="i-ic:twotone-wechat"></i>
            </a>
            <a
              class="color-[var(--aside-userinfo-qq-color)]"
              @click="copyToClipboard('QQ号', ownerQQ)"
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
    <template #body>
      <layout-content-menu />
    </template>
  </context-menu>
</template>

<script setup lang="ts" name="AsideIntroduceSelf">
// 引入仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
// 引入 处理后的数据
import { useShowUserinfo } from "@/hooks/showUserinfo"
// 提取需要展示的信息
const { showNickName, showSigner } = useShowUserinfo({
  showNickName: true,
  showSigner: true,
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
// 提取请求
const { reqUserInfo } = useUserStore()

// 发起请求
onMounted(async () => {
  await reqUserInfo()
})

const copyToClipboard = async (type: string, text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`复制${type}成功~`)
  } catch (error) {
    ElMessage.warning(`复制${type}成功~`)
  }
}
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
      top: var(--pin-top, 0);
      left: var(--pin-left, 0);
    }
  }
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
