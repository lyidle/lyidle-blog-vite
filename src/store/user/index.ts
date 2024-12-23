import { GetMenuList } from "@/api/admin/types/getMenuList"
import { getMenuList } from "@/api/admin"
// 把用户数据进行加密与解密
import { aes_encrypt, aes_decrypt } from "@/utils/crypto-aes"
export const useUserStore = defineStore(
  "User",
  () => {
    // 菜单
    const menuList = ref<GetMenuList["data"]>([])
    // 挂载仓库后直接发起请求
    const userMenuList = async () => {
      const result = await getMenuList()
      menuList.value = result
    }
    // 用户信息
    const userInfo = reactive({
      userName: "Fut🥝",
      avater:
        "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
      signer: "Future is now 🍭🍭🍭",
      token: "",
    })
    return { menuList, userMenuList, userInfo }
  },
  // 对用户信息加密 有token
  {
    persist: {
      serializer: {
        deserialize: aes_decrypt,
        serialize: aes_encrypt,
      },
      key: "User",
      storage: localStorage,
      pick: ["userInfo"],
    },
  }
)
