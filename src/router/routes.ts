// 常量路由
export const constantRoute = [
  {
    path: "/",
    name: "index",
    redirect: "/home",
    component: () => import("@/components/layout/index.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        meta: { title: "首页" },
        component: () => import("@/views/home/index.vue"),
      },
    ],
  },
  {
    path: "/doc/:category/:id",
    name: "Document",
    meta: { title: "文章" },
    component: () => import("@/views/doc/index.vue"),
  },
  {
    path: "/note",
    name: "Note",
    meta: { title: "笔记" },
    component: () => import("@/components/layout/index.vue"),
    children: [
      {
        path: "test",
        name: "Test",
        meta: { title: "Test" },
        component: () => import("@/views/test/index.vue"),
      },
      {
        path: "test2",
        name: "Test2",
        meta: { title: "笔记" },
        component: () => import("@/views/test2/index.vue"),
      },
    ],
  },
  {
    path: "/person",
    name: "Person",
    meta: { title: "个人" },
    component: () => import("@/components/layout/index.vue"),
    children: [
      {
        path: "/person/about",
        name: "About",
        meta: { title: "关于" },
        component: () => import("@/views/about/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    meta: { title: "登录" },
    component: () => import("@/views/login/index.vue"),
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
