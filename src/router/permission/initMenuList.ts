// 引入仓库
import { useUserStore } from "@/store/user"
import router from "@/router"
// 引入 mitt
import { mitt } from "@/utils/emitter"
import { RouteRecordRaw } from "vue-router"
let isInitRoute = false
// 添加路由
const addRoute = async (
  routes: Ref<RouteRecordRaw[] | undefined>,
  reqUserMenuList: () => void
) => {
  // 获取菜单和权限
  await reqUserMenuList()
  // 添加路由
  routes.value?.forEach((item) => {
    router.addRoute(item)
  })
}

// 移除路由
const reloadRoute = async (
  routes: Ref<RouteRecordRaw[] | undefined>,
  reqUserMenuList: () => void
) => {
  // 移除路由
  routes.value?.forEach((item) => {
    // 存在注册的路由则移除
    if (item.name && router.hasRoute(item.name)) {
      // 检查路由是否存在
      router.removeRoute(item.name) // 使用路由的 name 属性
    }
  })
  // 获取菜单和权限
  await reqUserMenuList()
  await addRoute(routes, reqUserMenuList)
}

export const initMenuList = async () => {
  // 只初始化一次
  if (!isInitRoute) {
    // 提取数据
    const { routes } = storeToRefs(useUserStore())
    const { reqUserMenuList } = useUserStore()
    await addRoute(routes, reqUserMenuList)
    // 监听是否重载路由
    mitt.on("route:reload", () => reloadRoute(routes, reqUserMenuList))
    isInitRoute = true
  }
}
