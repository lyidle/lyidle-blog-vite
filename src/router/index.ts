import { createRouter, createWebHistory } from "vue-router"
import { constantRoute, anyRoute } from "@/router/routes"
import { usePermission } from "./permission"
const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoute, ...anyRoute],
  scrollBehavior(to, from, savedPosition) {
    if (to.fullPath === from.fullPath) {
      return false // 不滚动
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

export default usePermission(router)
