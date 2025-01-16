import { createRouter, createWebHistory } from "vue-router"
import { constantRoute, anyRoute } from "@/router/routes"
import { usePermission } from "./permission"
const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoute, ...anyRoute],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})
export default usePermission(router)
