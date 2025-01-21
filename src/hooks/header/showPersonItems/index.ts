// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入类型
import type { Child } from "@/api/admin/types/getMenuList"
/* 
    用于展示 个人导航项 的信息
*/
export const useShowPersonItems = () => {
  // 个人选项卡展示的数据
  const PersonData = reactive<Child[]>([
    {
      id: 1,
      name: "关于",
      icon: "i-akar-icons:paper-airplane",
      to: "/person/about",
    },
    {
      id: 2,
      name: "登录",
      icon: "i-material-symbols:login",
      to: "/login",
    },
  ])

  // 订阅是否登录 的事件
  mitt.on("isLogin", (newV) => {
    console.log(newV)
  })

  return PersonData
}
