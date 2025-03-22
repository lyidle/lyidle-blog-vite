// 引入 仓库
import { useUserStore } from "@/store/user"
import { useSettingStore } from "@/store/setting"
// 引入 unocss 图标
import "./icons"
// 引入类型
import type {
  MenuItemStyle,
  menuItemType,
  menuView,
} from "@/components/layout/header/types"

// 引入 hooks
import { useShowUserinfo } from "@/hooks/showUserinfo"

export type headerItemReturnType = ComputedRef<menuView>
let id = 0
export const useShowPersonHeaderMenu = (): headerItemReturnType => {
  const { showAccount } = useShowUserinfo({ showAccount: true })
  // 提取 数据
  const { userToken, userRoles, userPermissions } = storeToRefs(useUserStore())
  const { setScene, isShowPanel } = storeToRefs(useSettingStore())
  // 提取 函数
  const { userStoreReset } = useUserStore()
  const paddingLeft = "var(--header-topmenu-icon-pl)"
  // 默认的数据
  const normalData: menuItemType[] = [
    {
      id: `${++id}`,
      name: "关于",
      icon: { icon: "i-akar-icons:paper-airplane" },
      to: "/person/about",
    },
  ]

  // 未登录的数据
  const unLoginData: menuItemType[] = [
    ...normalData,
    {
      id: `${++id}`,
      name: "登录",
      icon: { icon: "i-material-symbols:login" },
      to: "/login",
    },
  ]

  const unLoginStyle: MenuItemStyle = {
    width: "4.375rem",
    pl: paddingLeft,
  }

  // 登录的数据
  const loginData: menuItemType[] = [
    ...normalData,
    {
      id: `${++id}`,
      name: "退出登录",
      icon: { icon: "i-material-symbols:login", style: { rotate: "180deg" } },
      to: "/",
      click: async () => {
        // 调用 退出登录的函数
        await userStoreReset()
      },
    },
    {
      id: `${++id}`,
      name: "个人中心",
      icon: { icon: "i-charm:person" },
      to: `/user/space/${showAccount?.value}`,
    },
    {
      id: `${++id}`,
      name: "编辑用户",
      icon: { icon: "i-basil:edit-outline" },
      click: () => {
        setScene.value = 1
        isShowPanel.value = true
      },
    },
  ]

  // 需要 docs 权限的
  const docs: menuItemType[] = [
    {
      id: `${++id}`,
      name: "发布文章",
      icon: { icon: "i-simple-line-icons:doc" },
      to: "/doc/publish",
    },
  ]

  // 需要 admin 权限的
  const manager: menuItemType[] = [
    {
      id: `${++id}`,
      name: "管理页面",
      icon: { icon: "i-charm:person" },
      to: "/admin",
    },
  ]

  const loginStyle: MenuItemStyle = {
    width: "5.9375rem",
    pl: paddingLeft,
  }
  // 个人选项卡展示的数据
  const PersonData = computed(() => {
    if (!userToken.value) {
      return { data: unLoginData, style: unLoginStyle } as menuView
    }
    // 没有权限的
    if (!userRoles.value.length) {
      return { data: loginData, style: loginStyle } as menuView
    }
    if (userRoles.value.length) {
      const data = new Set([loginData])
      // 有 发布的文章的 权限 则添加
      if (userPermissions.value.includes("doc:publish")) data.add(docs)
      // 有 admin 角色 则添加
      if (userRoles.value.includes("admin")) data.add(manager)
      const result = [...data].flat(Infinity)
      // 清除 set
      data.clear()
      return { data: result, style: loginStyle } as menuView
    }
  })

  return PersonData as headerItemReturnType
}
