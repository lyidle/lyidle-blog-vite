<template>
  <div class="flex gap-2 flex-wrap">
    <el-tag
      v-for="(tag, i) in tags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
      :type="tagsType[i % tagsType.length]"
      class="!h-25px"
      :style="{ marginLeft: left }"
    >
      {{ tag }}
    </el-tag>
    <template v-if="tags!?.length < +max">
      <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        class="!w-80px !h-25px"
        :style="{ marginLeft: left }"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <my-button
        v-else
        type="default"
        class="button-new-tag w-80px !h-25px"
        :style="{ marginLeft: left }"
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
import { tagsType } from "."
const tags = defineModel<string[]>()
const props = withDefaults(
  defineProps<{
    min?: number | string
    max?: number | string
    error?: string
    repeatError?: string
    left?: string
    itemReg?: RegExp
    itemError?: string
  }>(),
  {
    min: 1,
    max: 10,
    error: "标签个数需要在1-10之间",
    itemReg: () => /^.{1,10}$/,
    itemError: "标签长度需要在1-10之间哦",
    repeatError: "标签不能重复",
    left: "",
  }
)
const inputValue = ref("")
const inputVisible = ref(false)
const InputRef = ref<InputInstance>()

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

// 输入框关闭
const handleClose = async (tag: string) => {
  await emit("before-close")
  // 标签个数
  if ((tags.value?.length || 0) <= +props.min) {
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
  if (len < +props.min || len > +props.max) {
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

  // 单个的 标签长度判断
  if (!props.itemReg.test(inputValue.value)) {
    resetInput()
    ElMessage.error(props.itemError)
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
  if (len < +props.min || len > +props.max) {
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
