<template>
  <div class="relative">
    <!-- at的列表 搜索 -->
    <div class="at-search-user flex flex-col" v-show="isSearch">
      <!-- title -->
      <div class="p-10px p-y-5px text-center flex-shrink-0">
        选择或者输入你想@的人
      </div>
      <!-- 用户列表 -->
      <div class="flex-1 overflow-hidden overflow-y-auto flex flex-col gap-5px">
        <div class="cur-text p-5px pl-10px w-fit">我的关注</div>
        <div
          v-for="user in users"
          :key="user.id"
          class="flex gap-10px p-x-10px p-y-5px hover:bg-blue-50 cur-pointer"
        >
          <!-- 头像 -->
          <global-avatar-src
            :account="user.account"
            :avatar="user.avatar"
            :style="{ '--avatar-size': '40px' }"
          ></global-avatar-src>
          <div class="flex flex-col gap-5px justify-center cur-pointer">
            <global-name
              :account="user.account"
              :nick="user.nickName"
            ></global-name>
            <div>{{ 100 }}粉丝</div>
          </div>
        </div>
      </div>
    </div>
    <el-input
      v-bind="$attrs"
      ref="instance"
      :model-value="modelValue"
      @input="handleInput"
      @update:model-value="handleModelUpdate"
      @keydown.ctrl.z.prevent="undo"
      @keydown.ctrl.y.prevent="redo"
      @click="handlerClick"
      @blur="handlerBlur"
    >
      <template v-for="(_, name) in slots" #[name]="scopedData">
        <slot :name="name" v-bind="scopedData" v-if="scopedData"></slot>
        <slot :name="name" v-else></slot>
      </template>
    </el-input>
    {{ isSearch }}
  </div>
</template>

<script setup lang="ts" name="MySearchAccountInput">
// api
import { getFollower } from "@/api/user/follow"
import { findByAccount } from "@/api/user"
// 防抖
import debounce from "@/utils/debounce"
// 类型
import type { ElInput } from "element-plus"
import type { GetFollowUser } from "@/api/user/follow/types/getFollowUser"
// 仓库
import { useUserStore } from "@/store/user"
import { FindByAccount } from "@/api/user/types/findByAccount"

const { userId } = storeToRefs(useUserStore())

const isSearch = ref(false)

// 事件处理
const handlerClick = async (...args: any[]) => {
  emit("click", args)
  const textarea = args[0].target as HTMLTextAreaElement
  const text = textarea?.value
  const start = textarea.selectionStart
  const value = text.substring(0, start)
  // 搜索 通过文本提取 是否 @并搜索用户
  searchAccountByText(value)
}
const handleInput = debounce(async (value: string) => {
  // 保存值
  saveToHistory()
  // 触发父组件的input
  emit("update:modelValue", value)
  emit("input", value)
  // 搜索 通过文本提取 是否 @并搜索用户
  searchAccountByText(value)
}, 500)
const handleModelUpdate = (value: string) => {
  emit("update:modelValue", value)
}

const normalPagination = {
  currentPage: 1,
  pageSize: 10,
}
const pagination = ref(normalPagination)

type userType = GetFollowUser["data"]["users"]
// 存储用户的数据
const users = ref<userType>([])

// 缓存 关注列表
const cacheUsersFollow = new Map<number, GetFollowUser["data"]>()
// 缓存 搜索列表
const cacheUsersSearch = new Map<string, FindByAccount["data"]>()

// 清除缓存
onBeforeUnmount(() => {
  cacheUsersFollow.clear()
  cacheUsersSearch.clear()
})

// 搜索 通过文本提取 是否 @并搜索用户
const searchAccountByText = async (text: string): Promise<void> => {
  // 没有 userId 不需要查询
  if (!userId.value) {
    isSearch.value = false
    return
  }
  if (!text) {
    isSearch.value = false
    return
  }
  // 判断是否是 @
  const keyword = extractLastAtTag(text)
  // 判断有无 [@keyword]
  if (keyword) {
    isSearch.value = true
    // 得到缓存
    const cache = cacheUsersSearch.get(keyword)
    // 有缓存 则不需要查询
    if (cache) {
      users.value = cache.users
      pagination.value = cache.pagination
      return
    }
    // 搜索 用户
    const result = await findByAccount({
      keyword,
      currentPage: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    })
    users.value = result.users
    pagination.value = result.pagination
    // 缓存值
    cacheUsersSearch.set(keyword, result)
    return
  }
  // 是否 at人 包含 [@]
  if (hasAtTag(text)) {
    isSearch.value = true
    // 得到 当前的 页码
    const cur = pagination.value.currentPage
    // 得到缓存
    const cache = cacheUsersFollow.get(cur)
    // 有缓存 则不需要查询
    if (cache) {
      users.value = cache.users
      pagination.value = cache.pagination
      return
    }
    // 查询关注
    const result = await getFollower({
      userId: userId.value,
      currentPage: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    })
    users.value = result.users
    pagination.value = result.pagination
    // 保存缓存
    cacheUsersFollow.set(cur, result)
    return
  }
  isSearch.value = false
}

// 提取出 at的人
const extractLastAtTag = (text: string): string | null => {
  const match = text.match(/\[@([^\]]+)\](?!.*\[@[^\]]+\])/)
  return match ? match[1] : null
}

const handlerBlur = (...args: any[]) => {
  // 重置 数据
  isSearch.value = false
  pagination.value = normalPagination
  users.value = []
  emit("blur", args)
}
// 是否 at人 包含 [@]
const hasAtTag = (text: string) => /.*?\[\@.*?\].*?/.test(text)

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
  (e: "click", ...args: any[]): void
  (e: "blur", ...args: any[]): void
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

<style scoped lang="scss">
.at-search-user {
  $size: 200px;
  position: absolute;
  top: -$size - 10px;
  left: 0;
  width: $size;
  height: $size;
  background-color: var(--primary-card-bg);
  box-shadow: 0 0px 5px rgba(115, 115, 115, 0.249);
  border-radius: 5px;
  z-index: 2;
}
</style>

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
