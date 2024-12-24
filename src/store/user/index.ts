import { GetMenuList } from "@/api/admin/types/getMenuList"
import { getMenuList } from "@/api/admin"
// 把用户数据进行加密与解密
import { aes_encrypt, aes_decrypt } from "@/utils/crypto-aes"
export const useUserStore = defineStore(
  "User",
  () => {
    // 公开的菜单数据
    const userMenuList = ref<GetMenuList["data"]>([])

    // 获取 公开的菜单数据
    const reqUserMenuList = async () => {
      const result = await getMenuList()
      userMenuList.value = result
    }

    // 用户名
    const userUserName = ref("Fut🥝")

    // 用户头像
    const userAvater = ref(
      "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
    )

    // 个性签名
    const userSigner = ref("Future is now 🍭🍭🍭")

    // 用户令牌
    const userToken = ref("")

    return {
      reqUserMenuList,
      userMenuList,
      userUserName,
      userAvater,
      userSigner,
      userToken,
    }
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
      pick: ["userUserName", "userAvater", "userSigner", "userToken"],
    },
  }
)
