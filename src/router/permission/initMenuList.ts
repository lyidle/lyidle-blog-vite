// 引入仓库
import { useUserStore } from "@/store/user"
let isInitMenuList = false
export const initMenuList = async () => {
  // 只初始化一次
  if (!isInitMenuList) {
    // 提取数据
    const { reqUserMenuList } = useUserStore()
    await reqUserMenuList()
    isInitMenuList = true
  }
}
