<template>
  <layout-header />
  <layout-banner></layout-banner>
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
// 设置 卡片 阴影
.login,
.reg {
  @include setCardShadow;
}

.login-container {
  position: absolute;
  width: 50%;
  z-index: $global-content-index;
  // 水平居中
  inset: 0;
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
// 按钮
// button样式
.el-button--primary {
  // active
  transition: background var(--primary-during);
  --el-button-bg-color: var(--login-btn-bg);
  --el-button-border-color: var(--login-btn-bg);
  --el-button-text-color: var(--login-btn-color);
  outline: none;
  --el-button-hover-bg-color: var(--login-btn-hover-bg);
  --el-button-hover-border-color: var(--login-btn-hover-bg);
  --el-button-hover-text-color: var(--login-btn-hover-color);
  --el-button-active-bg-color: var(--login-btn-hover-bg);
  --el-button-active-border-color: var(--login-btn-hover-bg);
  --el-button-active-text-color: var(--login-btn-hover-color);
  // disable
  --el-button-disabled-bg-color: var(--login-disabled-bg);
}
// input
.el-input__wrapper {
  &.is-focus {
    box-shadow: unset;
  }
  &:hover {
    box-shadow: unset;
  }
  background-color: unset;
  box-shadow: unset;
  border-radius: unset;
  border-bottom: 1px solid var(--login-input-underline-bg);
  margin: 0.0625rem 0.6875rem;
  padding: unset;
  --el-color-danger: transparent;
  input {
    height: 1.5rem;
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.8125rem;
    transition: font-size var(--primary-during);
    color: var(--login-input-color);
    &:focus {
      font-size: 0.9375rem;
    }
    &::placeholder {
      color: var(--login-input-placeholder);
    }
  }
}
</style>
