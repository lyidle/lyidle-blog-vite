<template>
  <el-tree
    style="max-width: 600px"
    :data="data"
    :props="defaultProps"
    @node-click="$emit('node-click')"
  />
</template>

<script setup lang="ts" name="MyTree">
import { Tree } from "./types"

withDefaults(defineProps<{ data?: Tree[] }>(), {
  data: () => [],
})

const defaultProps = {
  children: "children",
  label: "label",
}
</script>

<style scoped></style>
