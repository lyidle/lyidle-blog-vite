// 引入 仓库
import { useUserStore } from "@/store/user"
import { useSettingStore } from "@/store/setting"
// 引入 unocss 图标
import "./icons"
// 引入类型
import type { menuView } from "@/components/layout/header/types"
// 引入 hooks
import { useShowUserinfo } from "@/hooks/showUserinfo"
import { nanoid } from "nanoid"
export const useShowPersonHeaderMenu = () => {
  const { showAccount } = useShowUserinfo({ showAccount: true })
  // 提取 数据
  const { userToken, userRoles, userPermissions } = storeToRefs(useUserStore())
  const { setScene, isShowPanel } = storeToRefs(useSettingStore())
  // 提取 函数
  const { userStoreReset } = useUserStore()

  // 左边距
  const paddingLeft = "var(--header-topmenu-icon-pl)"

  const personData = computed(() => {
    return {
      data: [
        // 默认展示的 数据
        {
          id: nanoid(),
          name: "关于",
          icon: { icon: "i-akar-icons:paper-airplane" },
          to: "/person/about",
        },

        // 未登录的 数据
        {
          id: nanoid(),
          name: "登录",
          icon: { icon: "i-material-symbols:login" },
          to: "/login",
          hide: !!userToken.value,
        },

        // 登录后 展示的数据
        {
          id: nanoid(),
          name: "退出登录",
          icon: {
            icon: "i-material-symbols:login",
            style: { rotate: "180deg" },
          },
          to: "/",
          click: async () => {
            // 调用 退出登录的函数
            await userStoreReset()
          },
          hide: !userToken.value,
        },
        {
          id: nanoid(),
          name: "个人中心",
          icon: { icon: "i-charm:person" },
          to: `/user/space/${showAccount?.value}`,
          hide: !userToken.value,
        },
        {
          id: nanoid(),
          name: "编辑用户",
          icon: { icon: "i-basil:edit-outline" },
          click: () => {
            setScene.value = 1
            isShowPanel.value = true
          },
          hide: !userToken.value,
        },

        // 需要 具体 权限的数据
        {
          id: nanoid(),
          name: "发布文章",
          icon: { icon: "i-simple-line-icons:doc" },
          to: "/doc/publish",
          hide: !userPermissions.value.includes("doc:publish"),
        },
        {
          id: nanoid(),
          name: "管理页面",
          icon: { icon: "i-charm:person" },
          to: "/admin",
          hide: !userRoles.value.includes("admin"),
        },
      ],
      style: {
        width: userToken.value ? "5.9375rem" : "4.375rem",
        pl: paddingLeft,
      },
    } as menuView
  })

  return personData
}
