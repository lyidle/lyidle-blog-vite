<template>
  <el-select
    v-model="value"
    placeholder="Select"
    size="small"
    v-bind="$attrs"
    :teleported="false"
  >
    <el-option
      v-for="item in props.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup lang="ts" name="MySwitch">
const value = defineModel()
const props = defineProps(["options"])
</script>

<style scoped lang="scss"></style>
