<template>
  <layout-header></layout-header>
  <layout-banner></layout-banner>
  <div class="login-container">
    <loginCard ref="loginRef" :reg="regRef?.reg"></loginCard>
    <regCard ref="regRef" :login="loginRef?.login"></regCard>
  </div>
</template>

<script setup lang="ts" name="Login">
import { useSettingStore } from "@/store/setting"
// 导出仓库需要的东西
const { cardBoxShadow } = storeToRefs(useSettingStore())
// 引入组件
import loginCard from "./login/index.vue"
import regCard from "./reg/index.vue"
// 获取组件实例
const loginRef = ref()
const regRef = ref()
</script>

<style lang="scss">
$rotate-during: var(--login-rotate-during);
$link-color: var(--login-link-color);
$color: var(--primary-color);
.login-container {
  position: absolute;
  width: 50%;
  z-index: 2;
  // 水平居中
  inset: 0;
  margin: auto;
  color: $color;
  // 使用flex 内容居中
  display: flex;
  align-items: center;
  .reg,
  .login {
    width: 100%;
    // 都脱离文档流
    position: absolute;
    padding: 20px 40px;
    border-radius: 15px;
    box-shadow: v-bind(cardBoxShadow);
    background-color: var(--login-card-bg);
    backdrop-filter: blur(0.5px);
    // 旋转过渡
    transition: transform $rotate-during;
    // 当在背面时不可见
    backface-visibility: hidden;
    // 底部的提示信息 切换链接
    .tip {
      margin-top: 10px;
      .link {
        color: $link-color;
        @include pages-links-hover;
      }
    }
    // el-label
    .el-form-item__label {
      color: var(--primary-color);
      padding-right: unset;
    }
    // 应用按钮样式
    .primary-button {
      @include login-button;
    }
    // el-input
    @include login-input;
    // 表单验证的提示信息
    .el-form-item__error {
      left: 10px;
    }
  }
  .reg {
    // 先隐藏注册
    transform: rotateY(180deg);
  }
}
</style>
