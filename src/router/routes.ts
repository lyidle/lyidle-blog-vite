// 引入类型
import { asyncRoutesTest } from "@/test/asyncRoute"
// 引入 测试 的路由
import { RouteRecordRaw } from "vue-router"
import { handlerRoutes } from "./handlerRoutes"

/* meta 参数
 * title 网页标签展示信息
 * bannerContextHidden Boolean 默认显示（false) 焦点图的文字信息是否展示 欢迎词 和 古诗
 * bannerWaves Boolean 默认不显示(false) 波浪动画
 * pagesMt 内容区域卡片的 上边距
 * fixedBannerUnAuto Boolean  默认固定(false) 是否自动固定
 * bannerWel 欢迎词的文本信息
 * bannerWelTextShadowHidden Boolean 默认显示(false) 欢迎词的阴影是否隐藏
 * bannerPoetry 古诗信息
 * roles [""] 角色判断
 * permissions [""] 权限判断
 *    替换 :param 为 params 或 query 的值
 *    优先找 params，再找 query
 *    bannerWel: "Welcome to :author",
 *    replaceWel: true, 配合 可以替换 author 到指定位置
 * isLogin 验证是否登录 没登陆的 跳转登录界面
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
          fixedBannerUnAuto: true,
        },
        component: () => import("@/views/doc/preview/index.vue"),
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
        meta: {
          title: "空间",
          bannerWel: "Welcome to the :author space",
          replaceWel: true,
          bannerWaves: true,
          pagesMt: "-30vh",
        },
        component: () => import("@/views/user/space/index.vue"),
      }, // 用户查询 所有文章
      {
        path: "/user/docs",
        name: "FindAllUserDocsRedirect",
        meta: {
          title: "文章总览",
          bannerWel: "文章总览",
          bannerPoetry: "",
          bannerWaves: true,
          pagesMt: "-30vh",
        },
        component: () => import("@/views/user/docs/index.vue"),
      }, // 用户查询 所有文章
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
      }, // 用户查询 所有文章
      {
        path: "/user/docs/restore/:author",
        name: "FindAllUserDocsRestore",
        meta: {
          title: "文章回收站",
          bannerWel: "文章回收站",
          bannerPoetry: "",
          bannerWaves: true,
          pagesMt: "-30vh",
        },
        component: () => import("@/views/user/docs/restore/index.vue"),
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
        meta: {
          title: "标签",
          bannerWel: "标签",
          bannerPoetry: "",
          bannerWaves: true,
          pagesMt: "-30vh",
        },
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
        meta: {
          title: "分类",
          bannerWel: "分类",
          bannerPoetry: "",
          bannerWaves: true,
          pagesMt: "-30vh",
        },
        component: () => import("@/views/user/categories/onlyOne/index.vue"),
      },
      // 消息
      {
        path: "/user/msg",
        name: "UserMessage",
        meta: {
          bannerContextHidden: true,
          bannerWaves: false,
          isLogin: true,
          title: "消息中心",
        },
        component: () => import("@/views/user/msg/index.vue"),
      },
    ],
  },
  //  查询标签
  {
    path: "/tags",
    name: "Tags",
    meta: { title: "标签", bannerWel: "标签" },
    component: () => import("@/components/layout/index.vue"),
    redirect: "/tags/search",
    children: [
      {
        path: "/tags/search",
        name: "TagsSearch",
        meta: { title: "标签", bannerWel: "标签" },
        component: () => import("@/views/tags/index.vue"),
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
        meta: {
          title: "关于",
          bannerWel: "关于",
          bannerPoetry: "",
          bannerWaves: true,
          pagesMt: "-30vh",
        },
        component: () => import("@/views/about/index.vue"),
      },
    ],
  },
  // 登录 与 注册
  {
    path: "/login",
    name: "Login",
    meta: { title: "登录", bannerContextHidden: true },
    component: () => import("@/views/login/index.vue"),
  },
  // 404
  {
    path: "/404",
    name: "404",
    meta: { title: "404", bannerHidden: true },
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
export const asyncRoute: RouteRecordRaw[] = handlerRoutes(
  [
    {
      name: "Admin",
      path: "/admin",
      meta: {
        title: "管理",
      },
      component: () => import("@/components/manager/index.vue"),
      redirect: "/admin/dashboard",
      children: [
        {
          name: "Dashboard",
          path: "/admin/dashboard",
          meta: { title: "仪表盘" },
          component: () => import("@/views/admin/dashboard/index.vue"),
        },
        {
          name: "Articles",
          path: "/admin/article",
          meta: { title: "文章管理" },
          component: () => import("@/views/admin/articles/manager/index.vue"),
        },
        {
          name: "AccessManagement",
          path: "/admin/access",
          meta: { title: "权限管理" },
          redirect: "/admin/access/users",
          children: [
            {
              name: "UserManagement",
              path: "/admin/access/users",
              meta: { title: "用户管理" },
              component: () => import("@/views/admin/access/users/index.vue"),
            },
            {
              name: "RoleManagement",
              path: "/admin/access/roles",
              meta: { title: "角色管理" },
              component: () => import("@/views/admin/access/roles/index.vue"),
            },
            {
              name: "GroupManagement",
              path: "/admin/access/groups",
              meta: { title: "权限组管理" },
              component: () => import("@/views/admin/access/groups/index.vue"),
            },
            {
              name: "PermissionManagement",
              path: "/admin/access/permissions",
              meta: { title: "权限管理" },
              component: () =>
                import("@/views/admin/access/permissions/index.vue"),
            },
            {
              name: "MenuManagement",
              path: "/admin/access/menus",
              meta: { title: "菜单管理" },
              component: () => import("@/views/admin/access/menus/index.vue"),
            },
          ],
        },
        {
          name: "RecycleManager",
          path: "/admin/recycle",
          meta: { title: "回收站" },
          redirect: "/admin/recycle/users",
          children: [
            {
              name: "UserRecycle",
              path: "/admin/recycle/users",
              meta: { title: "用户回收站" },
              component: () => import("@/views/admin/recycle/users/index.vue"),
            },
            {
              name: "RoleRecycle",
              path: "/admin/recycle/roles",
              meta: { title: "角色回收站" },
              component: () => import("@/views/admin/recycle/roles/index.vue"),
            },
            {
              name: "GroupRecycle",
              path: "/admin/recycle/groups",
              meta: { title: "权限组回收站" },
              component: () => import("@/views/admin/recycle/groups/index.vue"),
            },
            {
              name: "PermissionRecycle",
              path: "/admin/recycle/permissions",
              meta: { title: "权限回收站理" },
              component: () =>
                import("@/views/admin/recycle/permissions/index.vue"),
            },
            {
              name: "MenuRecycle",
              path: "/admin/recycle/menus",
              meta: { title: "菜单回收站" },
              component: () => import("@/views/admin/recycle/menus/index.vue"),
            },
          ],
        },
        {
          name: "Other",
          path: "/admin/other",
          meta: { title: "其他" },
          redirect: "/admin/other/banner",
          children: [
            {
              name: "BannerImg",
              path: "/admin/other/banner",
              meta: { title: "背景管理" },
              component: () => import("@/views/admin/other/banner/index.vue"),
            },
            {
              name: "Settings",
              path: "/admin/other/settings",
              meta: { title: "设置管理" },
              component: () => import("@/views/admin/other/settings/index.vue"),
            },
          ],
        },
      ],
    },
    // ...asyncRoutesTest,
  ],
  (item) => {
    // 隐藏 banner
    if (!item.meta?.bannerHidden) {
      item.meta!.bannerHidden = true
    }
    // 隐藏 header
    if (!item.meta?.headerHidden) {
      item.meta!.headerHidden = true
    }

    // 得到 roles
    const roles = item.meta?.roles as string[] | undefined
    // 添加 admin
    if (roles?.includes("admin")) {
      // 有数组 则 push
      if (roles?.length) {
        roles.push("admin")
      }
      // 没有数组 则创建
      else {
        item.meta!.roles = ["admin"]
      }
    }
  }
)
