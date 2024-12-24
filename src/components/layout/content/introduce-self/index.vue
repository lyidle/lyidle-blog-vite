<template>
  <context-menu>
    <my-card class="item-aside">
      <template #body>
        <div class="aside-container aside-userinfo">
          <div class="userInfo">
            <div class="avater">
              <router-link to="">
                <img
                  :src="userAvater"
                  alt=""
                  class="w-100% h-100% object-cover"
                />
              </router-link>
            </div>
            <div class="username font-size-1.5625rem text-center text">
              {{ userUserName }}
            </div>
            <div class="signer text-center text">{{ userSigner }}</div>
          </div>
          <div class="pages">
            <layout-link-pages></layout-link-pages>
          </div>
          <el-button type="primary" class="userinfo-btn">
            <div class="tip">前往小窝</div>
            <div class="car">
              <icon-car></icon-car>
            </div>
          </el-button>
          <div class="links">
            <a
              href="https://res.abeim.cn/api/qq/?qq=912512766"
              class="color-[var(--aside-userinfo-wechat-color)]"
              target="_self"
            >
              <i class="i-ic:twotone-wechat"></i>
            </a>
            <a
              href="https://res.abeim.cn/api/qq/?qq=912512766"
              class="color-[var(--aside-userinfo-qq-color)]"
              target="_self"
            >
              <icon-qq></icon-qq>
            </a>
            <a
              href="https://space.bilibili.com/238728646?spm_id_from=333.1007.0.0"
              target="_blank"
              class="color-[var(--aside-userinfo-bilibili-color)]"
            >
              <i class="i-simple-icons:bilibili"></i>
            </a>
            <a
              href="mailto:912512766@qq.com"
              class="color-[var(--aside-userinfo-mail-color)]"
              target="_self"
            >
              <i class="i-fluent-color:mail-24"></i>
            </a>
          </div>
        </div>
      </template>
    </my-card>
    <template #body>
      <context-menu-item
        :content="'编辑'"
        :icon="'i-basil:edit-outline'"
      ></context-menu-item>
      <layout-content-menu />
    </template>
  </context-menu>
</template>

<script setup lang="ts" name="IntroduceSelf">
// 引入仓库
import { useUserStore } from "@/store/user"
const { userUserName, userAvater, userSigner } = storeToRefs(useUserStore())
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
    @include primary-button;
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
      }
      // 引入悬浮动画
      @include car(svg, 2s, $userinfo-btn-car-size);
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
