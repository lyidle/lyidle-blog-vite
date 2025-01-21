// 引入api
import { getMenuList } from "@/api/admin"
import { getUserInfo } from "@/api/user"
// 引入 owner 仓库
import { useOwnerStore } from "@/store/owner"
// 引入类型
import type {
  GetMenuList,
  PurpleBannerImg,
} from "@/api/admin/types/getMenuList"

// 引入 整理 函数
import tinyCounts from "@/utils/tinyCounts"
// 引入 路由过滤函数
import { userStoreRoutesFilter } from "@/utils/routerFilter"

export const useUserStore = defineStore(
  "User",
  () => {
    // 用户的菜单数据
    const userMenuList = ref<GetMenuList["data"]>([])
    // 用户的 焦点图信息
    const userBannerImg = ref<{ [key in string]: PurpleBannerImg }>({})
    // 用户的 白名单路径
    const whitelist = ref<string[]>([])

    // 获取 公开的菜单数据
    const reqUserMenuList = async () => {
      try {
        const result = await getMenuList()
        // 调用函数 过滤出 仓库需要的信息
        const { _userBannerImg, _whitelist, _userMenuList } =
          userStoreRoutesFilter(result)
        // 赋值处理的结果
        userMenuList.value = _userMenuList
        userBannerImg.value = _userBannerImg
        whitelist.value = _whitelist
      } catch (error) {}
    }

    // 用户信息
    const userAccount = ref<string>()
    const userNickName = ref<string>()
    const userEmail = ref<string>()
    const userAvatar = ref<string | null>()
    const userSigner = ref<string | null>()
    const userRole = ref<string[]>([])
    const userToken = ref<string>()
    const userPages = ref<number>()
    const userTags = ref<number>()
    const userCategories = ref<number>()
    const reqUserInfo = async () => {
      try {
        const result = await getUserInfo()
        // 有用户信息 赋值
        if (result) {
          userRole.value = result?.[0]?.role || []
          userAccount.value = result?.[0]?.account
          userNickName.value = result?.[0]?.nickName
          userEmail.value = result?.[0]?.email
          userAvatar.value = result?.[0]?.avatar || null
          userSigner.value = result?.[0]?.signer || null
          const { pages, tags, categories } = tinyCounts(result?.[0]?.Articles)
          userPages.value = pages
          userTags.value = tags
          userCategories.value = categories
          return
        }
        // 如果没有登录
        // 获取admin的信息
        const { getAdminUserInfo } = useOwnerStore()
        await getAdminUserInfo()
      } catch (error) {}
    }

    // 重置数据
    const userStoreReset = () => {
      userBannerImg.value = {}
      whitelist.value = []
      userAccount.value = ""
      userNickName.value = ""
      userEmail.value = ""
      userAvatar.value = ""
      userSigner.value = ""
      userRole.value = []
      userToken.value = ""
      userPages.value = 0
      userTags.value = 0
      userCategories.value = 0
    }

    return {
      reqUserMenuList,
      userBannerImg,
      whitelist,
      userMenuList,
      reqUserInfo,
      // 用户信息
      userAccount,
      userNickName,
      userEmail,
      userAvatar,
      userSigner,
      userRole,
      userPages,
      userTags,
      userCategories,
      userToken,
      userStoreReset,
    }
  },
  // 对用户信息加密 有token
  {
    persist: {
      key: "User",
      storage: localStorage,
      pick: [
        "userBannerImg",
        "whitelist",
        "userAccount",
        "userNickName",
        "userEmail",
        "userAvatar",
        "userSigner",
        "userRole",
        "userToken",
      ],
    },
  }
)
