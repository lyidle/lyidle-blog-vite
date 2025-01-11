<template>
  <el-switch v-model="value" v-bind="$attrs" class="switch" />
</template>

<script setup lang="ts" name="MySwitch">
const value = defineModel()
</script>

<style scoped lang="scss">
.switch {
  --el-switch-on-color: var(--primary-switch-on);
  --el-switch-off-color: var(--primary-switch-off);
}
</style>
