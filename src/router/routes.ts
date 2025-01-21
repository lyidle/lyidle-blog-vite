// 引入类型
import { RouteRecordRaw } from "vue-router"
// 常量路由
export const constantRoute: RouteRecordRaw[] = [
  {
    path: "/",
    name: "index",
    redirect: "/home",
    component: () => import("@/components/layout/index.vue"),
    // 主页
    children: [
      {
        path: "/home",
        name: "Home",
        meta: { title: "首页" },
        component: () => import("@/views/home/index.vue"),
      },
    ],
  },
  // 文章
  {
    path: "/doc/:id",
    name: "Document",
    meta: { title: "文章" },
    component: () => import("@/views/doc/index.vue"),
  },
  // 用户相关
  {
    path: "/user",
    name: "User",
    meta: { title: "用户" },
    component: () => import("@/components/layout/index.vue"),
    children: [
      // 空间
      {
        path: "/user/space/:author",
        name: "UserSpace",
        meta: { title: "用户空间" },
        component: () => import("@/views/user/space/index.vue"),
      },
      // 用户查询 所有文章
      {
        path: "/user/docs/:author",
        name: "FindAllUserDocs",
        meta: { title: "用户所有文章" },
        component: () => import("@/views/user/docs/findAll/index.vue"),
      },
      // 用户查询 所有标签
      {
        path: "/user/tags/:author",
        name: "FindAllUserTags",
        meta: { title: "用户所有标签" },
        component: () => import("@/views/user/tags/findAll/index.vue"),
      },
      // 用户查询 一个标签
      {
        path: "/user/tags",
        name: "UserTags",
        meta: { title: "用户标签" },
        component: () => import("@/views/user/tags/onlyOne/index.vue"),
      },
      // 用户查询 所有分类
      {
        path: "/user/categories/:author",
        name: "FindAllUserCategories",
        meta: { title: "用户所有分类" },
        component: () => import("@/views/user/categories/findAll/index.vue"),
      },
      // 用户查询 一个分类
      {
        path: "/user/categories",
        name: "UserCategory",
        meta: { title: "用户分类" },
        component: () => import("@/views/user/categories/onlyOne/index.vue"),
      },
    ],
  },
  // 个人
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
  // 登录 与 注册
  {
    path: "/login",
    name: "Login",
    meta: { title: "登录" },
    component: () => import("@/views/login/index.vue"),
  },
  // 404
  {
    path: "/404",
    name: "404",
    meta: { title: "404" },
    component: () => import("@/views/404/index.vue"),
  },
]
// 任意路由
export const anyRoute: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*",
    meta: { hidden: true },
    redirect: "/404",
  },
]
// 异步路由 需要权限判断的
export const asyncRoute: RouteRecordRaw[] = [
  // 作品
  {
    path: "/piece",
    name: "Piece",
    meta: { title: "作品" },
    component: () => import("@/components/layout/index.vue"),
    redirect: "/piece/piece1",
    children: [
      {
        path: "/piece/piece1",
        name: "Piece1",
        meta: { title: "Piece1" },
        component: () => import("@/views/test/index.vue"),
      },
      {
        path: "/piece/piece2",
        name: "Piece2",
        meta: { title: "Piece2" },
        component: () => import("@/views/test/index.vue"),
      },
    ],
  },
  // 笔记
  {
    path: "/note",
    name: "Note",
    meta: { title: "笔记" },
    component: () => import("@/components/layout/index.vue"),
    children: [
      {
        path: "/note/note1",
        name: "Note1",
        meta: { title: "Test" },
        component: () => import("@/views/test/index.vue"),
      },
      {
        path: "/note/note2",
        name: "Note2",
        meta: { title: "笔记" },
        component: () => import("@/views/test2/index.vue"),
      },
    ],
  },
  // 留言板
  {
    path: "/comments",
    name: "Comments",
    meta: { title: "留言板" },
    component: () => import("@/views/test/index.vue"),
  },
]
