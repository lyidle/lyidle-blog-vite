<template>
  <div class="follow-container">
    <div class="nav-bar">
      <!-- 关注 -->
      <div class="nav-container">
        <div class="title">
          {{ userInfo?.id === userId ? "我" : "Ta" }}的关注
        </div>
        <ul class="nav-item-container">
          <li
            class="nav-item"
            :class="followerActive('normal')"
            @click="followerClick('normal')"
          >
            <icon-parse
              class="icon"
              icon='<svg t="1743071447513"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17252" width="50px" height="50px"><path d="M892.250862 846.746994 400.087653 846.746994c-37.007869 0-67.112514-30.105668-67.112514-67.113537 0-2.140757 0.480954-53.219085 41.334407-103.553471 23.50739-28.925796 55.534827-51.820226 95.208409-68.1174 47.931662-19.706831 107.399055-29.624714 176.653349-29.624714 69.251224 0 128.674615 10.005888 176.650279 29.624714 39.674605 16.298198 71.704089 39.192627 95.210455 68.1174 40.899502 50.334385 41.335431 101.413737 41.335431 103.553471C959.365422 816.641325 929.257707 846.746994 892.250862 846.746994zM377.716132 779.76444c0.044002 12.278651 10.092869 22.239514 22.370497 22.239514l492.163209 0c12.322653 0 22.324448-9.960863 22.372543-22.239514-0.048095-1.571798-1.444908-40.066531-33.033347-77.556377-43.606147-51.820226-125.009132-79.128175-235.420801-79.128175-110.412692 0-191.814654 27.39493-235.377822 79.128175C379.157971 739.78489 377.760135 778.192641 377.716132 779.76444z" fill="#ffffff" p-id="17253"></path><path d="M646.169257 533.550829c-98.704023 0-178.969091-80.264045-178.969091-178.968068 0-98.704023 80.265068-178.969091 178.969091-178.969091 98.700953 0 178.970114 80.265068 178.970114 178.969091C825.139372 453.286784 744.87021 533.550829 646.169257 533.550829zM646.169257 220.35671c-74.016761 0-134.227074 60.228733-134.227074 134.226051s60.210313 134.227074 134.227074 134.227074 134.227074-60.23078 134.227074-134.227074S720.186018 220.35671 646.169257 220.35671z" fill="#ffffff" p-id="17254"></path><path d="M265.861602 846.746994l-134.227074 0c-37.007869 0-67.112514-30.105668-67.112514-67.113537 0-1.660826 0.349971-41.46539 29.667693-80.527035 16.909112-22.588461 40.023552-40.460504 68.598354-53.175083 34.168194-15.205307 76.376505-22.895453 125.488039-22.895453 8.039093 0 15.904225 0.217964 23.594371 0.611937 12.32163 0.699941 21.759583 11.186783 21.147646 23.551392-0.611937 12.364609-11.18576 21.802562-23.50739 21.191648-6.904247-0.393973-13.982456-0.568958-21.191648-0.568958-174.205601 0-178.838108 106.438171-178.969091 111.98756 0.042979 12.234649 10.093892 22.239514 22.370497 22.239514l134.227074 0c12.365632 0 22.370497 10.005888 22.370497 22.37152 0 12.364609-10.004865 22.369473-22.370497 22.369473L265.861602 846.746994z" fill="#ffffff" p-id="17255"></path><path d="M288.231075 578.293869c-73.973782 0-134.226051-60.210313-134.226051-134.227074 0-73.994248 60.252269-134.227074 134.226051-134.227074 73.973782 0 134.226051 60.232826 134.226051 134.227074C422.458149 518.083555 362.20588 578.293869 288.231075 578.293869zM288.231075 354.582761c-49.329499 0-89.484034 40.134069-89.484034 89.485057 0 49.353035 40.154535 89.483011 89.484034 89.483011 49.330522 0 89.485057-40.129976 89.485057-89.483011C377.716132 394.71683 337.561597 354.582761 288.231075 354.582761z" fill="#ffffff" p-id="17256"></path></svg>'
            ></icon-parse>
            <span class="label">全部关注</span>
            <span class="counts">{{ followerCounts || 0 }}</span>
          </li>
        </ul>
      </div>
      <!-- 粉丝 -->
      <div class="nav-container">
        <div class="title">
          {{ userInfo?.id === userId ? "我" : "Ta" }}的粉丝
        </div>
        <!-- 关注 -->
        <ul class="nav-item-container">
          <li
            class="nav-item"
            :class="followingActive()"
            @click="followingClick"
          >
            <i class="i-iconoir:user-love icon"></i>
            <span class="label">
              {{ userInfo?.id === userId ? "我" : "Ta" }}的粉丝
            </span>
            <span class="counts">{{ followingCounts || 0 }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="context">
      <layout-space-follow-context
        group="normal"
        title="全部关注"
        :isFollower="true"
        v-if="isFollower('normal')"
      ></layout-space-follow-context>
      <layout-space-follow-context
        :title="`${userInfo?.id === userId ? '我' : 'Ta'}的粉丝`"
        v-if="isFollowing()"
      ></layout-space-follow-context>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserSpaceFollower">
// 引入 仓库
import { useUserSpaceStore } from "@/store/userSpace"
import { useUserStore } from "@/store/user"
// 引入类型
import type { userSpaceSceneType } from "../scene/types"

const props = defineProps<{ account: string }>()

const route = useRoute()
const router = useRouter()

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

// 是否 是follower 中的 一个分组
const isFollower = (group: string) =>
  route.query.to === "follower" && route.query.group === group
/**
 * 关注列表
 * 计算 是否激活
 */
const followerActive = (group: string) => (isFollower(group) ? "active" : "")
// 关注列表的点击事件
const followerClick = (group: string) =>
  router.push(`/user/space/${props.account}?to=follower&group=${group}`)

// 是否 是follower 中的 一个分组
const isFollowing = () => route.query.to === "following"
/**
 * 粉丝列表
 * 计算 是否激活
 */
const followingActive = () => (isFollowing() ? "active" : "")
// 粉丝列表的点击事件
const followingClick = () =>
  router.push(`/user/space/${props.account}?to=following`)

// 本地 组件的分组
const localGroups = ["normal"]
// 保存用户的 关注组
const groups = ref<string[] | null>(null)
// 模拟 网络请求 分组 赋值
setTimeout(() => {
  groups.value = localGroups
}, 1000)

// 判断 路径是否出错
watchEffect(() => {
  const query = route.query
  const { group, to }: { group: string; to: userSpaceSceneType } = query as any
  // 未初始化 groups
  if (groups.value === null) return
  // 初始化groups 后判断 是否合法路径
  if (to === "follower" && !groups.value.includes(group))
    router.push(
      `/user/space/${props.account}?to=follower&group=${localGroups[0]}`
    )
})
</script>

<style scoped lang="scss">
// 左侧 导航的 间隔
$nav-item-gap-y: 10px;
$nav-item-gap-x: 8px;
$icon-size: 30px;
$icon-color: var(--primary-color);
$nav-title-mb: 15px;
$nav-title-size: 16px;
// 导航 容器的 下边界
$nav-container-mb: 15px;
// 导航 容器的 下内边距
$nav-container-pb: 15px;
// 分割线
$nav-hr: 1px solid var(--primary-color);
.follow-container {
  display: flex;
  gap: 30px;
  > .nav-bar {
    width: 200px;
    .nav-container {
      margin-bottom: $nav-container-mb;
      padding-bottom: $nav-container-pb;
      border-bottom: $nav-hr;
      .title {
        font-size: $nav-title-size;
        margin-bottom: $nav-title-mb;
        user-select: text;
        cursor: var(--cursor-text);
      }
      > .nav-item-container {
        display: flex;
        gap: $nav-item-gap-y;
        margin-top: $nav-item-gap-y;
        flex-direction: column;
        > .nav-item {
          width: 190px;
          height: 52px;
          border-radius: 10px;
          padding: 10px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: $nav-item-gap-x;
          cursor: var(--cursor-pointer);
          &.active {
            background-color: #41b5e0;
            color: white;
            > .icon {
              color: white;
            }
          }
          > .icon {
            color: $icon-color;
            width: $icon-size;
            height: $icon-size;
            flex-shrink: 0;
          }
          > .label {
            width: 100%;
          }
          > .counts {
            width: 40px;
            flex-shrink: 0;
          }
        }
      }
    }
  }
  .context {
    width: 100%;
  }
}
</style>
