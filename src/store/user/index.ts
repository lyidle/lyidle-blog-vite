// 引入api
import { getMenuList } from "@/api/admin"
import { getUserInfo, reqLogout } from "@/api/user"
// 引入 异步路由
import { asyncRoute } from "@/router/routes"
// 引入类型
import type {
  GetMenuList,
  PurpleBannerImg,
} from "@/api/admin/types/getMenuList"
import { RouteRecordRaw } from "vue-router"

// 引入 路由过滤函数
import { userStoreRoutesFilter } from "@/utils/routerFilter"
import { mitt } from "@/utils/emitter"
import { filterManagerRoutes } from "@/router/permission/filterManagerRoutes"

export const useUserStore = defineStore(
  "User",
  () => {
    // 用户的菜单数据
    const userMenuList = ref<GetMenuList["data"]>([])
    //  后台管理的菜单
    const adminMenuList = ref<any[]>([])
    // 用户的 焦点图信息
    const userBannerImg = ref<{ [key in string]: PurpleBannerImg }>({})
    // 用户的 白名单路径
    const whitelist = ref<string[]>([])
    // 用户的 路由名单
    const routes = ref<RouteRecordRaw[]>()
    // 获取 公开的菜单数据
    const reqUserMenuList = async () => {
      try {
        const result = await getMenuList()

        // 调用函数 过滤出 仓库需要的信息
        const { _userBannerImg, _whitelist, _userMenuList, _routes } =
          userStoreRoutesFilter(result, userRole)

        // 过滤掉后台管理的菜单
        userMenuList.value = _userMenuList?.filter(
          (item) => item.name !== "Admin"
        )

        userBannerImg.value = _userBannerImg
        whitelist.value = _whitelist
        routes.value = _routes
      } catch (error) {}
    }

    // 处理 管理页面的菜单 数据
    const reqAdminMenuList = () => {
      // 调用函数 过滤完的manager结果
      adminMenuList.value = filterManagerRoutes()
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

          userPages.value = result?.[0].counts.pages
          userTags.value = result?.[0].counts.tags
          userCategories.value = result?.[0].counts.categories

          // 重新加载路由
          mitt.emit("route:reload")
          return
        }
      } catch (error) {}
    }

    // 重置数据
    const userStoreReset = async () => {
      try {
        // 退出登录
        await reqLogout()
        // 用户的菜单数据
        userMenuList.value = []
        // 管理页面的菜单数据
        adminMenuList.value = []
        // 用户的 焦点图信息
        userBannerImg.value = {}
        // 用户的 白名单路径
        whitelist.value = []
        // 用户信息
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
        ElMessage.success("退出登录成功~")
      } catch (error) {
        ElMessage.error({
          dangerouslyUseHTMLString: true,
          message: "退出登录失败~<br/><br/>123",
        })
      }
      // 重新加载路由
      mitt.emit("route:reload")
    }

    return {
      reqUserMenuList,
      adminMenuList,
      reqAdminMenuList,
      userBannerImg,
      whitelist,
      userMenuList,
      routes,
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
