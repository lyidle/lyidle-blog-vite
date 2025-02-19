<template>
  <div class="flex gap-2">
    <el-tag
      v-for="(tag, i) in tags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
      :type="tagsType[i % tagsType.length]"
      class="!h-25px"
    >
      {{ tag }}
    </el-tag>
    <template v-if="tags!?.length < max">
      <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        class="!w-80px !h-25px"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <my-button
        v-else
        type="default"
        class="button-new-tag w-80px !h-25px"
        size="small"
        @click="showInput"
      >
        + New Tag
      </my-button>
    </template>
  </div>
</template>

<script setup lang="ts" name="MyTags">
// 引入类型
import type { InputInstance } from "element-plus"
const tags = defineModel<string[]>()
const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    error?: string
    repeatError?: string
  }>(),
  {
    min: 1,
    max: 10,
    error: "标签个数需要在1-10之间哦~",
    repeatError: "标签不能重复哦~",
  }
)
const inputValue = ref("")
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

const tagsType = ["primary", "success", "info", "warning", "danger"]

// 夫组件的自定义事件
const emit = defineEmits<{
  "before-close": []
  "before-confirm": []
  "after-confirm": []
}>()

const resetInput = () => {
  inputVisible.value = false
  inputValue.value = ""
}

const handleClose = async (tag: string) => {
  await emit("before-close")
  // 没内容
  if ((tags.value?.length || 0) <= props.min) {
    ElMessage.error(props.error)
  }
  tags.value?.splice(tags.value.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}

// 验证
const validate = () => {
  const len = tags.value?.length || 0
  if (len < props.min || len > props.max) {
    ElMessage.error(props.error)
    resetInput()
    throw new Error(props.error)
  }
}

const handleInputConfirm = async () => {
  // 没内容
  if (!inputValue.value) {
    resetInput()
    return
  }
  // 重复
  if (tags.value?.includes(inputValue.value)) {
    ElMessage.error(props.repeatError)
    resetInput()
    return
  }
  // 验证没有通过
  const len = (tags.value?.length || 0) + 1
  if (len < props.min || len > props.max) {
    ElMessage.error(props.error)
    resetInput()
    return
  }
  tags.value?.push(inputValue.value)
  resetInput()
}

defineExpose({ resetInput, validate })
</script>

<style scoped></style>
