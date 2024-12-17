import { menuListType } from "@/api/user/type"
import { reqMenuList } from "@/api/user"
export const useUserStore = defineStore(
  "user",
  () => {
    // 菜单
    const menuList = ref<menuListType[]>([])
    // 挂载仓库后直接发起请求
    const userMenuList = async () => {
      const result = await reqMenuList()
      menuList.value = result
    }
    // 用户信息
    const userInfo = reactive({
      userName: "Fomalhaut🥝",
      avater:
        "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      signer: "Future is now 🍭🍭🍭",
      token: "",
    })
    return { menuList, userMenuList, userInfo }
  },
  {
    persist: {
      key: "User",
      storage: localStorage,
      pick: ["userInfo"],
    },
  }
)
