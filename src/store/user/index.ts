import { menuListType } from "@/api/user/type"
export const useUserStore = defineStore("user", () => {
  // 使unocss 的动态图标生效
  // @unocss-include
  const menuList = reactive<menuListType[]>([
    {
      id: 1,
      title: "首页",
      icon: "i-ep:home-filled",
      to: "/home",
    },
    {
      id: 2,
      title: "作品",
      icon: "i-mdi:collection",
      to: "",
      data: [
        {
          id: 1,
          name: "test",
          to: "/test",
        },
        {
          id: 2,
          name: "test2",
          to: "/test2",
        },
      ],
    },
    {
      id: 3,
      title: "笔记",
      icon: "i-lucide:notebook-pen",
      to: "/note",
    },
    {
      id: 4,
      title: "筛选",
      icon: "i-tdesign:filter-3-filled",
      to: "",
    },
    {
      id: 5,
      title: "音乐",
      icon: "i-flowbite:list-music-outline",
      to: "",
    },
    {
      id: 6,
      title: "图库",
      icon: "i-jam:picture-f",
      to: "",
    },
    {
      id: 7,
      title: "留言板",
      icon: "i-uil:message",
      to: "",
    },
    {
      id: 8,
      title: "友链",
      icon: "i-heroicons-solid:link",
      to: "",
    },
    {
      id: 9,
      title: "简介",
      icon: "i-iconoir:page-star",
      to: "",
    },
  ])
  return { menuList }
})
