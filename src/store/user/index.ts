// 引入api
import { getMenuList } from "@/api/admin"
import { getUserInfo } from "@/api/user"
import { searchUser } from "@/api/user"
// 引入类型
import type { GetMenuList } from "@/api/admin/types/getMenuList"
import { Datum } from "@/api/user/types/searchUser"
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

    // 用户信息
    const userInfo = ref<Datum>()

    const reqUserInfo = async () => {
      const result = await getUserInfo()
      // 如果没有登录
      if (!result) {
        // 获取admin的信息
        const result = await searchUser({ role: "admin" })
        if (result) userInfo.value = result[0]
      }
      // @ts-ignore
      userInfo.value = result
    }

    return {
      reqUserMenuList,
      userMenuList,
      userInfo,
      reqUserInfo,
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
