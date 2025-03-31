// 引入api
import { getBannerImg, getMenuList } from "@/api/admin"
import { getUserInfo, reqLogout } from "@/api/user"
import { reqAddTourist, reqDelTourist } from "@/api/webInfo"
// 引入类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
import type { RouteRecordRaw } from "vue-router"
import type { GetBannerImg } from "@/api/admin/types/getBannerImg"

// 引入 路由过滤函数
import { userStoreRoutesFilter } from "@/utils/routerFilter"
import { filterManagerRoutes } from "@/router/permission/filterManagerRoutes"
// 引入 mitt
import { mitt } from "@/utils/emitter"

// 引入 常量 路由
import { constantRoute, anyRoute } from "@/router/routes"
import { getPersistedData } from "@/utils/crypto/crypto-aes"

type bannerImgType = { [key in string]: GetBannerImg["data"][0] }
// 处理 常量路由 和异步路由
const handlerPath = () => {
  const paths: string[] = []
  const recur = (routes: RouteRecordRaw[]) => {
    routes.reduce((pre, cur) => {
      // path 存在
      if (cur.path) pre.push(cur.path)
      // children 存在
      if (cur.children) recur(cur.children)
      // 返回 paths
      return pre
    }, paths)
  }
  recur(constantRoute)
  recur(anyRoute)
  return Array.from(new Set([paths].flat(Infinity)))
}

export const useUserStore = defineStore(
  "User",
  () => {
    // 用户的菜单数据
    const userMenuList = ref<GetMenuList["data"]>([])
    //  后台管理的菜单 本地的 路由
    const adminMenuList = ref<RouteRecordRaw[]>([])
    //  后台管理的菜单 请求的数据
    const adminMenuListRaw = ref<GetMenuList["data"]>([])
    // 用户的 焦点图信息
    const userBannerImg = ref<bannerImgType>({})
    // 用户的 白名单路径
    const whitelist = ref<string[]>([])
    // 用户的 路由名单
    const routes = ref<RouteRecordRaw[]>()
    // 获取 公开的菜单数据
    const reqUserMenuList = async () => {
      try {
        const roles = (userRoles.value?.length && userRoles.value) || ["user"]
        const result = await getMenuList(roles)
        // 调用函数 过滤出 仓库需要的信息
        const { _whitelist, _userMenuList, _routes } =
          userStoreRoutesFilter(result)

        // 赋值 路由
        routes.value = _routes

        // 过滤掉后台管理的菜单
        userMenuList.value =
          (_userMenuList
            ?.map((item) => {
              if (!item.roles?.includes("admin")) return item
              adminMenuListRaw.value = [item]
            })
            .filter(Boolean) as GetMenuList["data"]) || []

        // 处理 白名单
        whitelist.value = Array.from(
          new Set([_whitelist, handlerPath()].flat(Infinity))
        ).filter(Boolean) as string[]

        // 得到 背景
        const banners = await getBannerImg()
        // 处理 背景
        userBannerImg.value = banners.reduce((pre, cur) => {
          // 在 白名单 且有light或dark或height
          if (
            whitelist.value.includes(cur.name) &&
            (cur.dark || cur.light || cur.height)
          )
            pre[cur.name] = cur
          return pre
        }, {} as bannerImgType)
      } catch (error) {
        ElMessage.error("获取菜单失败~")
      }
    }

    // 处理 管理页面的菜单 数据
    const reqAdminMenuList = () => {
      // 调用函数 过滤完的manager结果
      adminMenuList.value = filterManagerRoutes()
    }

    // 用户信息
    const userId = ref<number | null>(null)
    const userAccount = ref<string>("")
    const userIsBin = ref<string | null>(null)
    const userNickName = ref<string>("")
    const userEmail = ref<string>("")
    const userAvatar = ref<string | null>(null)
    const userSigner = ref<string | null>(null)
    const userRoles = ref<string[]>([])
    const userPermissions = ref<string[]>([])
    const userToken = ref<string>("")
    const userPages = ref<number>(0)
    const userTags = ref<number>(0)
    const userCategories = ref<number>(0)

    // 游客token
    const touristToken = ref<string>("")

    // 获取 用户信息 使用 token 获取
    const reqUserInfo = async () => {
      // 没有 token 退出
      if (!userToken.value) return
      try {
        const result = await getUserInfo()
        const user = result?.[0]
        // 有用户信息 赋值
        userId.value = user?.id ?? null
        userIsBin.value = user?.isBin || null
        userPermissions.value = user?.permissions
        userRoles.value = user?.roles || []
        userAccount.value = user?.account || ""
        userNickName.value = user?.nickName || ""
        userEmail.value = user?.email || ""
        userAvatar.value = user?.avatar || null
        userSigner.value = user?.signer || null
        userPages.value = user?.counts.pages || 0
        userTags.value = user?.counts.tags || 0
        userCategories.value = user?.counts.categories || 0
        // 删除 游客信息
        if (touristToken.value) {
          await reqDelTourist(touristToken.value)
          touristToken.value = ""
          // 重新 获取小站咨询
          mitt.emit("reloadWebInfo")
        }
      } catch (error) {
        ElMessage.error("获取用户信息失败")
      }
    }

    // 增加游客数量
    const addTourist = async () => {
      try {
        // 有 访客标识了 退出
        if (getPersistedData("User", "touristToken")) return
        const result = await reqAddTourist()
        if (result) {
          touristToken.value = result
          // 重新 获取小站咨询
          mitt.emit("reloadWebInfo")
        }
      } catch (error) {
        console.error(error, "增加游客标识失败")
      }
    }

    // 通过 设置 token 重新获取 数据
    const userInfoByToken = (token: string, callback?: () => void) => {
      userToken.value = token
      // 重新加载路由
      mitt.emit("route:reload", callback)
      // 判断 有无 token 是否修改了密码 修改了需要重新登录
      if (!token) {
        ElMessage.warning("修改密码后需要重新登录")
      }
    }

    // 重置用户信息 没有 重置 token
    const resetUserInfo = () => {
      // 用户信息
      userId.value = null
      userAccount.value = ""
      userIsBin.value = null
      userNickName.value = ""
      userEmail.value = ""
      userAvatar.value = ""
      userSigner.value = ""
      userRoles.value = []
      userPermissions.value = []
      userPages.value = 0
      userTags.value = 0
      userCategories.value = 0
    }

    // 重置菜单信息
    const resetMenuList = () => {
      // 用户的菜单数据
      userMenuList.value = []
      // 管理页面的菜单数据
      adminMenuList.value = []
      //  后台管理的菜单 请求的数据
      adminMenuListRaw.value = []
      // 用户的 焦点图信息
      userBannerImg.value = {}
      // 用户的 白名单路径
      whitelist.value = []
    }

    // 重置 状态的函数
    const resetStore = () => {
      // 重置菜单信息
      resetMenuList()
      // 重置用户信息
      resetUserInfo()
    }

    // 重置数据
    const userStoreReset = async () => {
      try {
        // 退出登录
        await reqLogout()
      } catch (error) {
        console.log(error, "退出登录失败")
      }
      ElMessage.success("退出登录成功")
      // 重置 状态
      resetStore()
      // 额外 重置 token
      userToken.value = ""
      await addTourist()
      // 重新加载路由
      mitt.emit("route:reload")
      // 重新 获取小站咨询
      mitt.emit("reloadWebInfo")
    }

    return {
      reqUserMenuList,
      adminMenuList,
      adminMenuListRaw,
      reqAdminMenuList,
      userBannerImg,
      whitelist,
      userMenuList,
      routes,
      reqUserInfo,
      resetStore,
      // 用户信息
      userId,
      userAccount,
      userIsBin,
      userNickName,
      userEmail,
      userAvatar,
      userSigner,
      userRoles,
      userPermissions,
      userPages,
      userTags,
      userCategories,
      userToken,
      userStoreReset,
      userInfoByToken,
      resetUserInfo,
      resetMenuList,
      addTourist,
      touristToken,
    }
  },
  {
    persist: {
      key: "User",
      storage: localStorage,
      pick: [
        "userBannerImg",
        "whitelist",
        "userId",
        "userAccount",
        "userNickName",
        "userEmail",
        "userAvatar",
        "userSigner",
        "userRoles",
        "userToken",
        "touristToken",
      ],
    },
  }
)
