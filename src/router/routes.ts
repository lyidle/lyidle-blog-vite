// 引入类型
import { asyncRoutesTest } from "@/test/asyncRoute"
// 引入 测试 的路由
import { RouteRecordRaw } from "vue-router"

/* meta 参数
 * title 网页标签展示信息
 * bannerContextHidden Boolean 焦点图的文字信息是否展示 欢迎词 和 古诗
 * bannerWaves Boolean 波浪动画
 * pagesMt 内容区域卡片的 上边距 和 banner 展示信息的 上边距
 * bannerWel 欢迎词的文本信息
 * bannerWelTextShadowHidden Boolean 欢迎词的阴影是否隐藏
 * bannerPoetry 古诗信息
 * roles [""] 角色判断
 * permissions [""] 权限判断
 */

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
    path: "/doc",
    name: "Document",
    meta: { title: "文章" },
    component: () => import("@/components/layout/index.vue"),
    children: [
      // 文章
      {
        path: "/doc/:id",
        name: "Document",
        meta: {
          title: "文章",
          bannerContextHidden: true,
          pagesMt: "-30vh",
          bannerWaves: true,
        },
        component: () => import("@/views/doc/review/index.vue"),
      },
      // 发布文章 需要有对应的权限
      {
        path: "/doc/publish",
        name: "DocumentPublish",
        meta: { title: "发表文章", permissions: ["doc:publish"] },
        component: () => import("@/views/doc/publish/index.vue"),
      },
      // 修改文章 需要有对应的权限 账号要一致
      // query author id
      {
        path: "/doc/update",
        name: "DocumentUpdate",
        meta: { title: "修改文章" },
        component: () => import("@/views/doc/update/index.vue"),
      },
    ],
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
        meta: { title: "空间" },
        component: () => import("@/views/user/space/index.vue"),
      },
      // 用户查询 所有文章
      {
        path: "/user/docs/:author",
        name: "FindAllUserDocs",
        meta: {
          title: "文章总览",
          bannerWel: "文章总览",
          bannerPoetry: "",
          bannerWaves: true,
          pagesMt: "-30vh",
        },
        component: () => import("@/views/user/docs/index.vue"),
      },
      // 用户查询 所有标签
      {
        path: "/user/tags/:author",
        name: "FindAllUserTags",
        meta: {
          title: "标签总览",
          bannerWel: "标签总览",
          bannerPoetry: "",
          bannerWaves: true,
          pagesMt: "-30vh",
        },
        component: () => import("@/views/user/tags/findAll/index.vue"),
      },
      // 用户查询 一个标签
      {
        path: "/user/tags",
        name: "UserTags",
        meta: { title: "标签", bannerWel: "标签" },
        component: () => import("@/views/user/tags/onlyOne/index.vue"),
      },
      // 用户查询 所有分类
      {
        path: "/user/categories/:author",
        name: "FindAllUserCategories",
        meta: {
          title: "分类总览",
          bannerWel: "分类总览",
          bannerPoetry: "",
          bannerWaves: true,
          pagesMt: "-30vh",
        },
        component: () => import("@/views/user/categories/findAll/index.vue"),
      },
      // 用户查询 一个分类
      {
        path: "/user/categories",
        name: "UserCategory",
        meta: { title: "分类", bannerWel: "分类" },
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
  {
    name: "Admin",
    path: "/admin",
    meta: { title: "管理", roles: ["admin"] },
    component: () => import("@/components/manager/index.vue"),
    redirect: "/admin/dashboard",
    children: [
      {
        name: "Dashboard",
        path: "/admin/dashboard",
        meta: { title: "仪表盘", roles: ["admin"] },
        component: () => import("@/views/admin/dashboard/index.vue"),
      },
      {
        name: "ArticleManagement",
        path: "/admin/articles",
        meta: { title: "文章管理", roles: ["admin"] },
        redirect: "/admin/articles/list",
        children: [
          {
            name: "ArticleList",
            path: "/admin/articles/list",
            meta: { title: "文章列表", roles: ["admin"] },
            component: () => import("@/views/admin/articles/list/index.vue"),
          },
          {
            name: "CategoryManagement",
            path: "/admin/articles/category",
            meta: { title: "分类管理", roles: ["admin"] },
            component: () =>
              import("@/views/admin/articles/category/index.vue"),
          },
          {
            name: "TagManagement",
            path: "/admin/articles/tag",
            meta: { title: "标签管理", roles: ["admin"] },
            component: () => import("@/views/admin/articles/tag/index.vue"),
          },
        ],
      },
      {
        name: "AccessManagement",
        path: "/admin/access",
        meta: { title: "权限管理", roles: ["admin"] },
        redirect: "/admin/access/users",
        children: [
          {
            name: "UserManagement",
            path: "/admin/access/users",
            meta: { title: "用户管理", roles: ["admin"] },
            component: () => import("@/views/admin/access/users/index.vue"),
          },
          {
            name: "RoleManagement",
            path: "/admin/access/roles",
            meta: { title: "角色管理", roles: ["admin"] },
            component: () => import("@/views/admin/access/roles/index.vue"),
          },
          {
            name: "GroupManagement",
            path: "/admin/access/groups",
            meta: { title: "权限组管理", roles: ["admin"] },
            component: () => import("@/views/admin/access/roles/index.vue"),
          },
          {
            name: "PermissionManagement",
            path: "/admin/access/permissions",
            meta: { title: "权限管理", roles: ["admin"] },
            component: () => import("@/views/admin/access/roles/index.vue"),
          },
          {
            name: "MenuManagement",
            path: "/admin/access/menus",
            meta: { title: "菜单管理", roles: ["admin"] },
            component: () => import("@/views/admin/access/menus/index.vue"),
          },
        ],
      },
    ],
  },
  ...asyncRoutesTest,
]
