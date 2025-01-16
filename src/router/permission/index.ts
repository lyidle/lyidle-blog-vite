import type { Router } from "vue-router"
export const usePermission = (router: Router) => {
  router.beforeEach((to, from, next) => {
    next()
  })
  return router
}
