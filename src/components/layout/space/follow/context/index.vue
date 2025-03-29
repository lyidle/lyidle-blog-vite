<template>
  <div class="context-container">
    <!-- 头部 -->
    <header class="flex justify-between">
      <!-- 标题 -->
      <div class="title text-24px font-bold">{{ title }}</div>
      <!-- 操作按钮 -->
      <div class="btns" v-if="users?.length">
        <my-button
          type="default"
          v-if="route.query.to === 'follower' && userId === userInfo?.id"
          @click="isEditor = !isEditor"
          class="w-100px"
          >{{ isEditor ? "返回" : "批量操作" }}</my-button
        >
      </div>
    </header>
    <!-- 工具栏 -->
    <div
      class="flex justify-between mt-[var(--gap-y)]"
      v-if="userId === userInfo?.id"
    >
      <!-- 操作按钮 -->
      <div class="btns">
        <!-- 全选 按钮 -->
        <el-checkbox
          class="!mr-30px"
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          v-if="isShowEditor"
        >
          <div class="color-[var(--primary-color)]">
            全选<span class="ml-5px"
              >已选择<span>
                <span class="mx-5px"> {{ checkedUserId.length }}</span> </span
              >个关注</span
            >
          </div>
        </el-checkbox>
      </div>
      <!-- 全选按钮的操作 -->
      <my-button
        v-if="isShowEditor"
        class="w-100px"
        type="warning"
        @click="delAllFollower"
        >取消关注</my-button
      >
      <!-- 搜索 -->
      <div class="relative w-200px" v-if="!isEditor">
        <my-input v-model="searchKey" placeholder="请输入关键词"> </my-input>
        <i
          class="i-weui:search-outlined w-20px h-20px absolute right-10px top-0 cur-pointer"
        ></i>
      </div>
    </div>
    <!-- 用户展示 -->
    <el-checkbox-group
      class="userInfo"
      :style="{ '--item-width': isAside ? '280px' : '270px' }"
      v-model="checkedUserId"
      @change="handleCheckedCitiesChange"
      v-if="isShowEditor"
    >
      <el-checkbox v-for="user in users" :key="user.id" :value="user.id">
        <layout-space-follow-context-user
          :user
          :isFollower
        ></layout-space-follow-context-user>
      </el-checkbox>
    </el-checkbox-group>
    <!-- 用户展示 -->
    <div
      class="userInfo"
      :style="{ '--item-width': isAside ? '280px' : '270px' }"
      v-else
    >
      <div v-for="user in users" :key="user.id">
        <layout-space-follow-context-user
          :user
          :isFollower
        ></layout-space-follow-context-user>
      </div>
    </div>
    <my-pagination
      background
      layout="prev, pager, next, sizes"
      :total="pagination.total"
      :page-sizes="[10, 20, 30]"
      @change="reqUsers"
      class="justify-center mt-[var(--gap-y)]"
    />
  </div>
</template>

<script setup lang="ts" name="UserSpaceFolloweContext">
// 引入 接口
import { delFollow, getFollower, getFollowing } from "@/api/user/follow"
// 类型
import type { GetFollowUser } from "@/api/user/follow/types/getFollowUser"
import type { CheckboxValueType } from "element-plus"
// 引入 仓库
import { useUserSpaceStore } from "@/store/userSpace"
import { useUserStore } from "@/store/user"
import { useSettingStore } from "@/store/setting"
import { mitt } from "@/utils/emitter"
const {
  // 关注数
  followerCounts,
  // 粉丝数
  followingCounts,
  // 用户信息
  userInfo,
} = storeToRefs(useUserSpaceStore())
// 得到本地 userId
const { userId } = storeToRefs(useUserStore())
const { isAside } = storeToRefs(useSettingStore())

const props = defineProps<{
  title: string
  group?: string
  isFollower?: boolean
}>()

// 分页数据
const pagination = ref<GetFollowUser["data"]["pagination"]>({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 是否是 批量编辑
const isEditor = ref(false)
const route = useRoute()
const isShowEditor = computed(() => {
  const to = route.query.to
  return to === "follower" && isEditor.value
})

// 用户 数据
const users = ref<GetFollowUser["data"]["users"]>()

// 搜索的key
const searchKey = ref<string>("")

// 请求函数
const reqUsers = async (currentPage: number = 1, pageSize: number = 10) => {
  if (!userInfo.value) return
  let result: GetFollowUser["data"] | null = null
  // 是否是关注
  if (props.isFollower) {
    result = await getFollower({
      userId: userInfo.value.id,
      total: followerCounts.value || 0,
      currentPage: currentPage || pagination.value.currentPage,
      pageSize: pagination.value.pageSize,
    })
  } else {
    // 是否是粉丝
    result = await getFollowing({
      userId: userInfo.value.id,
      total: followingCounts.value || 0,
      currentPage: currentPage || pagination.value.currentPage,
      pageSize: pageSize || pagination.value.pageSize,
    })
  }
  users.value = result.users
  normalUserId.value = result.users.map((item) => item.id)
  pagination.value = result.pagination
}

// 用于判断是否第一次 监听过
let hasWatched = false
// 监听 followerCounts 数量
const stop = watchEffect(async () => {
  // 没有初始化
  if (typeof userInfo.value?.id !== "number") return
  if (followingCounts.value === null && followerCounts.value === null) return
  // 只发起一次请求
  try {
    stop()
  } catch (error) {
    hasWatched = true
  }
  await reqUsers()
})
if (hasWatched) {
  stop()
}

// 关注按钮的事件 回调
const handlerFollow = (options: { userId: number; is: boolean }) => {
  const { userId, is } = options
  const find = users.value?.find((item) => item.id === userId)
  if (find) find.isFollow = is
}
// 注册 关注按钮的事件
mitt.on("isFollowUser", handlerFollow)

onBeforeUnmount(() => {
  mitt.off("isFollowUser", handlerFollow)
})

// 批量取消关注
const delAllFollower = async () => {
  if (!checkedUserId.value.length) {
    ElMessage.warning("请选择关注的用户")
    return
  }

  // 包含 关注的 user过滤出来
  const ids: number[] = users.value
    ?.map(
      (item) =>
        typeof item.isFollow === "boolean" &&
        item.isFollow &&
        checkedUserId.value.includes(item.id) &&
        item.id
    )
    .filter(Boolean) as number[]

  // 批量取消，使用allSettled获取所有结果
  const results = await Promise.allSettled(ids.map((item) => delFollower(item)))

  // 统计成功和失败的数量
  const successfulResults = results.filter(
    (result) => result.status === "fulfilled"
  )
  const failedResults = results.filter((result) => result.status === "rejected")

  // 如果有失败的，显示具体哪些账号失败
  if (failedResults.length > 0) {
    const failedAccounts = failedResults.map((result) => {
      if (result.reason instanceof Error) {
        return result.reason.message
      }
      return "未知账号取消失败"
    })

    failedAccounts.forEach((message) => {
      ElMessage.warning(message) // 使用warning显示每个失败的具体账号
    })
  }

  // 更新关注数量（只减去成功取消的数量）
  if (followerCounts.value) {
    followerCounts.value = followerCounts.value - successfulResults.length
  } else {
    followerCounts.value = 0
  }

  // 重新请求数据
  await reqUsers()

  // 根据结果显示不同的提示信息
  if (failedResults.length === 0) {
    ElMessage.success(`成功取消${successfulResults.length}个关注`)
  } else if (successfulResults.length === 0) {
    ElMessage.error("取消关注全部失败")
  } else {
    ElMessage.warning(
      `成功取消${successfulResults.length}个关注，${failedResults.length}个取消失败`
    )
  }

  // 退出编辑模式
  isEditor.value = false
}

// 取消关注单个
const delFollower = async (id: number) => {
  try {
    await delFollow(id)
  } catch (error) {
    const result = users.value?.find((item) => item.id === id)
    const account = result?.account
    const msg = `${account ? `账号:${account}` : `id:${id}`} 的关注取消失败`
    throw new Error(msg) // 抛出错误以便外层捕获
  }
}

// 多选框
const checkAll = ref(false)
const isIndeterminate = ref(false)
const checkedUserId = ref<number[]>([])
const normalUserId = ref<number[]>([])

const handleCheckAllChange = (val: CheckboxValueType) => {
  checkedUserId.value = val ? normalUserId.value : []
  isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === normalUserId.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < normalUserId.value.length
}
</script>

<style scoped lang="scss">
.context-container {
  --gap-y: 20px;
  height: 100%;
  > .userInfo {
    display: grid;
    margin-top: var(--gap-y);
    gap: 40px;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fill, var(--item-width));
    ::v-deep(.el-checkbox) {
      height: 100%;
      margin: unset;
    }
    ::v-deep(.user) {
      color: var(--primary-color);
      &:hover {
        .follow-more .more {
          opacity: 1;
        }
      }
      .follow-more:has(:hover) .more {
        color: var(--primary-links-hover);
      }
    }
  }
  ::v-deep(.el-checkbox) {
    cursor: var(--cursor-pointer);
    .el-checkbox__input {
      cursor: var(--cursor-pointer);
    }
  }
} // 更多的 菜单项
.follow-more {
  ::v-deep(.custom-menu) {
    position: absolute;
    left: unset;
    transform: unset;
    right: -10px;
    z-index: 1;
    .title {
      left: 70%;
      right: unset;
      transform: unset;
    }
  }
}
</style>
