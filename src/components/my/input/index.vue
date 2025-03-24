<template>
  <el-input
    v-bind="$attrs"
    ref="instance"
    :model-value="modelValue"
    @input="handleInput"
    @update:model-value="handleModelUpdate"
  >
    <template v-for="(_, name) in slots" #[name]="scopedData">
      <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
      <slot :name="name" v-else></slot>
    </template>
  </el-input>
</template>

<script setup lang="ts" name="MyInput">
import type { ElInput } from "element-plus"

const props = withDefaults(
  defineProps<{
    modelValue: string
    maxHistorySteps?: number
  }>(),
  {
    maxHistorySteps: 100,
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
  (e: "input", value: string): void
}>()

const instance = ref<InstanceType<typeof ElInput>>()
const slots = defineSlots()

// 历史记录状态（内部私有）
const history = reactive({
  stack: [] as { text: string; cursorPos: number }[],
  index: -1,
})

// 保存历史记录（暴露方法）
const saveToHistory = () => {
  const text = props.modelValue
  const cursorPos = instance.value?.textarea?.selectionStart || 0

  // 跳过重复记录
  if (history.stack[history.index]?.text === text) return

  // 维护历史堆栈
  history.stack = history.stack.slice(0, history.index + 1)
  history.stack.push({ text, cursorPos })
  history.index = Math.min(
    history.stack.length - 1,
    props.maxHistorySteps ?? 100 - 1
  )
}

// 撤销操作（暴露方法）
const undo = () => {
  if (history.index <= 0) return
  history.index--
  applyHistoryState()
}

// 重做操作（暴露方法）
const redo = () => {
  if (history.index >= history.stack.length - 1) return
  history.index++
  applyHistoryState()
}

// 应用历史状态（内部方法）
const applyHistoryState = () => {
  const record = history.stack[history.index]
  if (!record) return

  emit("update:modelValue", record.text)

  nextTick(() => {
    instance.value?.textarea?.setSelectionRange(
      record.cursorPos,
      record.cursorPos
    )
  })
}

// 事件处理
const handleInput = (value: string) => {
  emit("update:modelValue", value)
  emit("input", value)
}

const handleModelUpdate = (value: string) => {
  emit("update:modelValue", value)
}

// 暴露指定的方法和实例
defineExpose({
  instance,
  saveToHistory,
  undo,
  redo,
})

// 初始化保存
nextTick(saveToHistory)
</script>

<style lang="scss">
// #region input
.el-input__wrapper {
  &.is-focus {
    box-shadow: unset;
  }
  &:hover {
    box-shadow: unset;
  }
  background-color: transparent !important;
  box-shadow: unset;
  --el-disabled-border-color: none;
  border-radius: unset;
  border-bottom: 1px solid var(--primary-input-underline-bg);
  margin: 0.0625rem 0.6875rem;
  padding: unset;
  --el-color-danger: transparent;
  .el-icon {
    color: var(--primary-input-color);
  }
  input {
    height: 1.5rem;
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.8125rem;
    transition: font-size var(--primary-during);
    color: var(--primary-input-color) !important;
    -webkit-text-fill-color: var(--primary-input-color) !important;
    &:focus {
      font-size: 0.9375rem;
    }
    &::placeholder {
      color: var(--primary-input-placeholder);
    }
  }
}

.login-container .el-input__wrapper {
  .el-icon {
    color: var(--login-input-color);
  }
  border-bottom: 1px solid var(--login-input-underline-bg);
  input {
    transition: font-size var(--primary-during);
    color: var(--login-input-color) !important;
    -webkit-text-fill-color: var(--login-input-color) !important;
    &::placeholder {
      color: var(--login-input-placeholder);
    }
  }
}
// #endregion input

// #region textarea
.el-textarea {
  textarea {
    background: transparent;
    color: var(--primary-color);
    resize: none;
  }
  .el-input__count {
    background-color: transparent;
    bottom: 10px;
    right: 5px;
    color: var(--primary-color);
  }
}
// #endregion textarea
</style>
