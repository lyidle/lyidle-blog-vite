// 引入 仓库
import { useUserStore } from "@/store/user"
// 引入 unocss 图标
import "./icons"
// 引入类型
import type { PersonMenuList } from "@/components/layout/header/types"
import { useShowUserinfo } from "@/hooks/showUserinfo"

export type ReturnType = {
  data: PersonMenuList[]
  style: { left: string; width: string }
}
export type headerItemReturnType = ComputedRef<ReturnType>

export const useShowPersonHeaderMenu = (): headerItemReturnType => {
  const { showAccount } = useShowUserinfo({ showAccount: true })
  // 提取 数据
  const { userToken, userRole } = storeToRefs(useUserStore())
  // 提取 函数
  const { userStoreReset } = useUserStore()
  // 默认的数据
  const normalData: PersonMenuList[] = [
    {
      id: `${Math.random()}`,
      name: "关于",
      icon: { icon: "i-akar-icons:paper-airplane" },
      to: "/person/about",
    },
  ]

  // 未登录的数据
  const unLoginData: PersonMenuList[] = [
    ...normalData,
    {
      id: `${Math.random()}`,
      name: "登录",
      icon: { icon: "i-material-symbols:login" },
      to: "/login",
    },
  ]

  const unLoginStyle = {
    left: "-0.9375rem",
    width: "4.375rem",
  }

  // 登录的数据
  const loginData: PersonMenuList[] = [
    ...normalData,
    {
      id: `${Math.random()}`,
      name: "退出登录",
      icon: { icon: "i-material-symbols:login", style: { rotate: "180deg" } },
      to: "/",
      click: async () => {
        // 调用 退出登录的函数
        await userStoreReset()
      },
    },
    {
      id: `${Math.random()}`,
      name: "个人中心",
      icon: { icon: "i-charm:person" },
      to: `/user/space/${showAccount?.value}`,
    },
  ]

  // 需要 docs 权限的
  const docs = [
    {
      id: `${Math.random()}`,
      name: "发布文章",
      icon: { icon: "i-simple-line-icons:doc" },
      to: "/doc/publish",
    },
  ]

  // 需要 admin 权限的
  const manager = [
    {
      id: `${Math.random()}`,
      name: "管理页面",
      icon: { icon: "i-charm:person" },
      to: "/manager",
    },
  ]

  const loginStyle = {
    left: "-1.5625rem",
    width: "5.9375rem",
  }
  // 个人选项卡展示的数据
  const PersonData = computed(() => {
    if (!userToken.value) {
      return { data: unLoginData, style: unLoginStyle }
    } else if (userRole.value.length) {
      const data = new Set([loginData])
      // 有 发布的文章的 权限 则添加
      if (userRole.value.includes("doc:publish")) data.add(docs)
      // 有 admin 权限 则添加
      if (userRole.value.includes("admin")) data.add(manager)

      const result = [...data].flat(Infinity)

      // 清除 set
      data.clear()
      return { data: result, style: loginStyle }
    }
  })
  return PersonData as headerItemReturnType
}
