<template>
  <el-input v-bind="$attrs"><slot></slot></el-input>
</template>

<script setup lang="ts" name="MyInput"></script>

<style scoped lang="scss">
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
  margin: 1px 11px;
  padding: unset;
  --el-color-danger: transparent;
  input {
    height: 24px;
    border: none;
    outline: none;
    width: 100%;
    font-size: 13px;
    transition: font-size var(--primary-during);
    color: var(--login-input-color);
    &:focus {
      font-size: 15px;
    }
    &::placeholder {
      color: var(--login-input-placeholder);
    }
  }
}
</style>
