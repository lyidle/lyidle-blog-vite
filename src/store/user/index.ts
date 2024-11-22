import { menuListType } from "@/api/user/type"
import { reqMenuList } from "@/api/user"
export const useUserStore = defineStore("user", () => {
  let menuList = ref<menuListType[]>([])
  // 挂载仓库后直接发起请求
  const userMenuList = async () => {
    const result = await reqMenuList()
    menuList.value = result.data
  }
  const homeLightUrl = 'url("/static/images/base-bg-light-01.png")'
  return { menuList, homeLightUrl, userMenuList }
})
