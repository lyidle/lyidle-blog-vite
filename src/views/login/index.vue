<template>
  <div class="login-container">
    <loginCard ref="loginRef" :reg="regRef?.reg"></loginCard>
    <regCard ref="regRef" :login="loginRef?.login"></regCard>
  </div>
</template>

<script setup lang="ts" name="Login">
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
// 设置 卡片 样式
@include setCardStyle(scend-opacity, false);
.login-container {
  position: absolute;
  width: 50%;
  transition: width var(--primary-during);
  z-index: $global-content-index;
  // 水平居中
  inset: 0;
  // 需要 移动到 导航条下方
  top: var(--header-height);
  margin: auto;
  color: var(--primary-color);
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
    // 表单验证的提示信息
    .el-form-item__error {
      left: 10px;
    }
  }
  .reg {
    // 先隐藏注册
    transform: rotateY(180deg);
  }
  @include media(sm) {
    width: 90%;
  }
}
</style>
