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
        <div class="cur-text p-5px pl-10px w-fit flex-shrink-0">我的关注</div>
        <div
          class="flex flex-shrink-0 mt-5px gap-10px p-x-10px p-y-5px hover:bg-blue-50 cur-pointer"
          v-for="user in users"
          @click="replaceAt(user)"
        >
          <!-- 头像 -->
          <global-avatar-src
            :account="user.account"
            :avatar="user.avatar"
            :isTo="false"
            :style="{ '--avatar-size': '40px' }"
          ></global-avatar-src>
          <div class="flex flex-col gap-5px justify-center cur-pointer">
            <global-name
              :account="user.account"
              :nick="user.nickName"
              nickClass="cur-pointer"
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
  </div>
</template>

<script setup lang="ts" name="MySearchAccountInput">
// api
import { getFollower } from "@/api/user/follow"
import { findByAccountPagination } from "@/api/user"
// 防抖
import debounce from "@/utils/debounce"
// 类型
import type { ElInput } from "element-plus"
import type { GetFollowUser } from "@/api/user/follow/types/getFollowUser"
// 仓库
import { useUserStore } from "@/store/user"
import { getPersistedData, setPersistedData } from "@/utils/crypto/crypto-aes"
import { saveUsersWithDeduplication } from "@/utils/saveUsersWithDeduplication"

const { userId } = storeToRefs(useUserStore())

const isSearch = ref(false)

// 事件处理
const handlerClick = async (...args: any[]) => {
  emit("click", args)
  searchCallback()
}
const handleInput = debounce(async (value: string) => {
  // 保存值
  saveToHistory()
  // 触发父组件的input
  emit("update:modelValue", value)
  emit("input", value)
  // 搜索 通过文本提取 是否 @并搜索用户
  searchCallback()
}, 500)
const handleModelUpdate = (value: string) => {
  emit("update:modelValue", value)
}
const searchCallback = () => {
  const textarea = instance.value?.textarea as HTMLTextAreaElement
  if (!textarea) return
  const text = textarea?.value
  const start =
    textarea.selectionStart - 10 < 0 ? 0 : textarea.selectionStart - 10
  const end = textarea.selectionStart
  const value = text.substring(start, end)
  // 搜索 通过文本提取 是否 @并搜索用户
  searchAccountByText(value)
}

const normalPagination = {
  currentPage: 1,
  pageSize: 10,
}
const pagination = ref(normalPagination)

type userType = GetFollowUser["data"]["users"]
// 存储用户的数据
const users = ref<userType>([])

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
    // 从 localStorage 获取缓存
    const cache = getPersistedData(`searchUsers_${keyword}`)

    // 有缓存且未过期则不需要查询
    if (cache) {
      users.value = cache.users
      pagination.value = cache.pagination
      // 保存用户数据到本地缓存（自动去重）
      saveUsersWithDeduplication(cache.users)
      return
    }

    // 搜索用户
    const result = await findByAccountPagination({
      keyword,
      currentPage: pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    })

    users.value = result.users
    pagination.value = result.pagination

    // 缓存到 localStorage，设置1小时过期时间
    setPersistedData(`searchUsers_${keyword}`, result, 60 * 60 * 1000)

    // 保存用户数据到本地缓存（自动去重）
    saveUsersWithDeduplication(result.users)
    return
  }

  // 是否 at人 包含 [@]
  if (hasAtTag(text)) {
    isSearch.value = true
    // 得到当前的页码
    const cur = pagination.value.currentPage
    // 从 localStorage 获取缓存
    const cache = getPersistedData(`followUsers_${userId.value}_${cur}`)

    // 有缓存且未过期则不需要查询
    if (cache) {
      users.value = cache.users
      pagination.value = cache.pagination
      // 保存用户数据到本地缓存（自动去重）
      saveUsersWithDeduplication(cache.users)
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

    // 缓存到 localStorage，设置1小时过期时间
    setPersistedData(
      `followUsers_${userId.value}_${cur}`,
      result,
      60 * 60 * 1000
    )

    // 保存用户数据到本地缓存（自动去重）
    saveUsersWithDeduplication(result.users)
    return
  }

  isSearch.value = false
}

// 点击替换at的人
const replaceAt = (user: userType[0]) => {
  // 得到账户名
  const account = user.account
  // 获取 textarea 的 DOM 元素
  const textarea = instance.value?.textarea

  if (!textarea) return

  // 获取当前光标位置
  const cursorPos = textarea.selectionStart

  // 获取输入框的值
  const currentValue = textarea.value

  // 查找光标位置之前的 [@.*?] 模式
  const textBeforeCursor = currentValue.substring(0, cursorPos)
  const regex = /\[@.*?\]$/ // 匹配以 [@ 开头，] 结尾的最短字符串
  const match = textBeforeCursor.match(regex)

  if (match) {
    // 找到匹配项，进行替换
    const matchedText = match[0]
    const startPos = cursorPos - matchedText.length
    const endPos = cursorPos
    saveToHistory()
    // 构建新值：匹配文本之前的部分 + 账户名 + 匹配文本之后的部分
    const newValue =
      currentValue.substring(0, startPos) +
      `[@${account}]` +
      currentValue.substring(endPos)
    // 更新输入框的值
    textarea.value = newValue
    saveToHistory()
  }
}

// 提取出 at的人
const extractLastAtTag = (text: string): string | null => {
  const match = text.match(/\[@([^\]]+)\](?!.*\[@[^\]]+\])/)
  return match ? match[1] : null
}

const handlerBlur = (...args: any[]) => {
  setTimeout(() => {
    // 重置 数据
    isSearch.value = false
    pagination.value = normalPagination
    users.value = []
  }, 100)
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
