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
 * role [""] 权限判断
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
        meta: { title: "发表文章", role: ["doc:publish"] },
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
    name: "Manager",
    path: "/manager",
    meta: { title: "管理", role: ["admin"] },
    component: () => import("@/components/Manager/index.vue"),
    redirect: "/manager/dashBoard",
    children: [
      {
        name: "DashBoard",
        path: "/manager/dashBoard",
        meta: { title: "仪表盘", role: ["admin"] },
        component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
      },
      {
        name: "MenuManagement",
        path: "/manager/menu",
        meta: { title: "菜单管理", role: ["admin"] },
        component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
        redirect: "/manager/menu/list",
        children: [
          {
            name: "MenuList",
            path: "/manager/menu/list",
            meta: { title: "菜单列表", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
          {
            name: "MenuEdit",
            path: "/manager/menu/edit/",
            meta: { title: "编辑菜单", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
          {
            name: "MenuCreate",
            path: "/manager/menu/create",
            meta: { title: "创建菜单", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
        ],
      },
      {
        name: "UserManagement",
        path: "/manager/user",
        meta: { title: "用户管理", role: ["admin"] },
        component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
        redirect: "/manager/user/list",
        children: [
          {
            name: "UserList",
            path: "/manager/user/list",
            meta: { title: "用户列表", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
          {
            name: "UserEdit",
            path: "/manager/user/edit/",
            meta: { title: "编辑用户", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
          {
            name: "UserCreate",
            path: "/manager/user/create",
            meta: { title: "创建用户", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
        ],
      },
      {
        name: "RoleManagement",
        path: "/manager/role",
        meta: { title: "角色管理", role: ["admin"] },
        component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
        redirect: "/manager/role/list",
        children: [
          {
            name: "RoleList",
            path: "/manager/role/list",
            meta: { title: "角色列表", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
          {
            name: "RoleEdit",
            path: "/manager/role/edit/",
            meta: { title: "编辑角色", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
          {
            name: "RoleCreate",
            path: "/manager/role/create",
            meta: { title: "创建角色", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
        ],
      },
      {
        name: "PermissionManagement",
        path: "/manager/permission",
        meta: { title: "权限管理", role: ["admin"] },
        component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
        redirect: "/manager/permission/list",
        children: [
          {
            name: "PermissionList",
            path: "/manager/permission/list",
            meta: { title: "权限列表", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
          {
            name: "PermissionEdit",
            path: "/manager/permission/edit/",
            meta: { title: "编辑权限", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
          {
            name: "PermissionCreate",
            path: "/manager/permission/create",
            meta: { title: "创建权限", role: ["admin"] },
            component: () => import("@/views/Manager/index.vue"), // 统一使用 index.vue
          },
        ],
      },
    ],
  },
  ...asyncRoutesTest,
]
