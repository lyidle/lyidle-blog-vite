// 引入 类型
import type { userSpaceSceneType } from "@/components/layout/space/scene/types"
import type { Datum as userInfoType } from "@/api/user/types/searchCountsById"
export const useUserSpaceStore = defineStore("UserSpace", () => {
  // 存储 用户信息
  const userInfo = ref<userInfoType | undefined>(undefined)
  // 关注数
  const followerCounts = ref<number | null>(null)
  // 粉丝数
  const followingCounts = ref<number | null>(null)
  // 获赞量
  const likeCounts = ref<number>(0)
  // 浏览量
  const viewCounts = ref<number>(0)
  // 场景
  const scene = ref<userSpaceSceneType>("home")
  return {
    userInfo,
    followerCounts,
    followingCounts,
    likeCounts,
    viewCounts,
    scene,
  }
})
