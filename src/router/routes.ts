// 常量路由
export const constantRoute = [
  {
    path: "/",
    name: "index",
    redirect: "home",
  },
  {
    path: "/home",
    name: "Home",
    meta: { title: "首页" },
    component: () => import("@/views/home/index.vue"),
  },
  {
    path: "/note",
    name: "Note",
    meta: { title: "笔记" },
    component: () => import("@/views/note/index.vue"),
  },
  {
    path: "/test",
    name: "Test",
    meta: { title: "Test" },
    component: () => import("@/views/test/index.vue"),
  },
  {
    path: "/test2",
    name: "Test2",
    meta: { title: "笔记" },
    component: () => import("@/views/test2/index.vue"),
  },
  {
    path: "/404",
    name: "404",
    meta: { title: "404" },
    component: () => import("@/views/404/index.vue"),
  },
]
// 任意路由
export const anyRoute = [
  {
    path: "/:pathMatch(.*)*",
    meta: { hidden: true },
    redirect: "/404",
  },
]
// 异步路由 需要权限判断的
export const asyncRoute = []
