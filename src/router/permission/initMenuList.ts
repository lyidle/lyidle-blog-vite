// 引入仓库
import { useUserStore } from "@/store/user"
import router from "@/router"
// 引入 mitt
import { mitt } from "@/utils/emitter"
let isInitRoute = false
// 添加路由
const addRoute = async () => {
  // 提取数据
  const { routes } = storeToRefs(useUserStore())
  const { reqUserMenuList } = useUserStore()
  // 获取菜单和权限
  await reqUserMenuList()
  // 添加路由
  routes.value?.forEach((item) => {
    router.addRoute(item)
  })
}

// 移除路由
const reloadRoute = async () => {
  // 提取数据
  const { routes } = storeToRefs(useUserStore())
  const { reqUserMenuList } = useUserStore()
  // 移除路由
  routes.value?.forEach((item) => {
    if (item.name) {
      router.removeRoute(item.name) // 使用路由的 name 属性
    }
  })
  // 获取菜单和权限
  await reqUserMenuList()
  await addRoute()
}

export const initMenuList = async () => {
  // 只初始化一次
  if (!isInitRoute) {
    await addRoute()
    // 监听是否重载路由
    mitt.on("route:reload", reloadRoute)
    isInitRoute = true
  }
}
