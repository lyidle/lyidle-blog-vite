// 引入仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
// 引入 路由
import router from "@/router"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 类型
import type { RouteRecordRaw } from "vue-router"

// 判断是否 初始化了 菜单
// 只初始化一次
let isInitRoute = false
// 添加路由
const addRoute = async (
  routes: Ref<RouteRecordRaw[] | undefined>,
  showInfo: () => void
) => {
  // 获取 用户 和 admin的 信息
  await showInfo()
  // 添加路由
  routes.value?.forEach((item) => {
    router.addRoute(item)
  })
}

// 移除路由
const reloadRoute = async (
  routes: Ref<RouteRecordRaw[] | undefined>,
  showInfo: () => void,
  callback?: () => void
) => {
  // 移除路由
  routes.value?.forEach((item) => {
    // 存在注册的路由则移除
    if (item.name && router.hasRoute(item.name)) {
      // 检查路由是否存在
      router.removeRoute(item.name) // 使用路由的 name 属性
    }
  })
  // 重新 获取 和添加 路由
  await addRoute(routes, showInfo)
  // 重新进行 权限判断
  mitt.emit("authRoles")
  // 有回调执行
  callback && callback()
}

export const initMenuList = async () => {
  // 只初始化一次
  if (!isInitRoute) {
    // 提取数据
    const { routes } = storeToRefs(useUserStore())
    // 获取 用户相关的信息
    const { reqUserMenuList, reqUserInfo, reqAdminMenuList } = useUserStore()
    // 获取admin的信息 用于展示 网页拥有者的一些信息
    const { getAdminUserInfo, getOwnerInfo } = useOwnerStore()

    // 合并 user 和 admin 的请求
    const showInfo = async () => {
      // 得到 用户的 信息 菜单信息依赖token
      await reqUserInfo()
      // 处理 其他请求
      await Promise.allSettled([
        // 得到 admin 的信息 网页展示 默认信息展示
        getAdminUserInfo(),
        // 得到 网站的联系方式
        getOwnerInfo(),
        // 获取菜单
        reqUserMenuList(),
      ])
      // 依赖 用户的菜单
      // 过滤出 管理页面的菜单项
      await reqAdminMenuList()
    }

    // 添加路由
    await addRoute(routes, showInfo)
    // 监听是否重载路由
    mitt.on(
      "route:reload",
      async (callback?: () => void) =>
        await reloadRoute(routes, showInfo, callback)
    )
    isInitRoute = true
  }
}
