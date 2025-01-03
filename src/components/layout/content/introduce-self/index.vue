<template>
  <context-menu>
    <layout-content-aside-card>
      <template #body>
        <div class="aside-container aside-userinfo">
          <div class="pin" content="admin" v-if="!userAccount"></div>
          <div class="userInfo">
            <div class="avater">
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
                  class="w-100% h-100% object-cover"
                />
              </router-link>
            </div>
            <div class="username font-size-1.5625rem text-center cur-text">
              {{ userNickName || (userAccount ? "" : adminNickName) }}
            </div>
            <div class="signer text-center cur-text">
              {{ userSigner || (userAccount ? "" : adminSigner) }}
            </div>
          </div>
          <div class="pages">
            <layout-link-pages></layout-link-pages>
          </div>
          <my-primary-button type="primary" class="userinfo-btn">
            <div class="tip">前往小窝</div>
            <div class="car">
              <icon-car></icon-car>
            </div>
          </my-primary-button>
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
      <context-menu-item
        :content="'编辑'"
        :icon="'i-basil:edit-outline'"
      ></context-menu-item>
      <layout-content-menu />
    </template>
  </context-menu>
</template>

<script setup lang="ts" name="AsideIntroduceSelf">
// 引入仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
// 提取需要的数据
const {
  // 用户信息
  userAccount,
  userNickName,
  userAvatar,
  userSigner,
} = storeToRefs(useUserStore())
const {
  // 管理员信息 用于展示没登陆的默认信息
  adminAccount,
  adminNickName,
  adminAvatar,
  adminSigner,
  // 网站 所有者信息
  ownerWeChat,
  ownerQQ,
  ownerBiliBili,
  ownerEmail,
} = storeToRefs(useOwnerStore())
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
    console.log(`复制${type}失败,请重试！`)
  }
}
</script>

<style scoped lang="scss">
$gap: 20px;
$avater-size: 110px;
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
      left: -0.5rem;
      top: 0.9375rem;
    }
  }
  .userInfo {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: $userinfo-gap;
    .avater {
      width: $avater-size;
      height: $avater-size;
      border-radius: 50%;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      overflow: hidden;
    }
  }
  .pages {
    width: 100%;
    ::v-deep(.header-title) {
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
