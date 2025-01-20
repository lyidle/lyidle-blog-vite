// 引入 api
import { searchUser } from "@/api/user"
import { findOneSetting } from "@/api/admin"
// 引入 类型
import { Content as InfoContent } from "@/api/admin/types/Contact Info"
// 引入 整理 函数
import tinyCounts from "@/utils/tinyCounts"
export const useOwnerStore = defineStore("Owner", () => {
  // admin 信息
  const adminAccount = ref<string>()
  const adminNickName = ref<string>()
  const adminAvatar = ref<string | null>()
  const adminSigner = ref<string | null>()
  const adminPages = ref<number>()
  const adminTags = ref<number>()
  const adminCategories = ref<number>()
  // 网站设置信息
  const ownerWeChat = ref<string>()
  const ownerQQ = ref<string>()
  const ownerBiliBili = ref<string>()
  const ownerEmail = ref<string>()
  // 发起请求
  const getAdminUserInfo = async () => {
    try {
      const adminResult = await searchUser({ role: "admin" })
      adminAccount.value = adminResult?.[0]?.account
      adminNickName.value = adminResult?.[0]?.nickName
      adminAvatar.value = adminResult?.[0]?.avatar || null
      adminSigner.value = adminResult?.[0]?.signer || null
      const { pages, tags, categories } = tinyCounts(adminResult?.[0]?.Articles)
      adminPages.value = pages
      adminTags.value = tags
      adminCategories.value = categories
    } catch (error) {}
  }
  // 获取设置里的联系方式
  const getOwnerInfo = async () => {
    try {
      const result = await findOneSetting("联系方式")
      const content: InfoContent = result?.content as InfoContent
      if (content) {
        const { BiliBili, QQ, email, weChat } = content
        ownerWeChat.value = weChat
        ownerQQ.value = QQ
        ownerEmail.value = email
        ownerBiliBili.value = BiliBili
      }
    } catch (error) {}
  }
  return {
    getAdminUserInfo,
    // 管理员的信息
    adminAccount,
    adminNickName,
    adminAvatar,
    adminSigner,
    adminPages,
    adminTags,
    adminCategories,
    // 网站 所有者信息
    ownerWeChat,
    ownerQQ,
    ownerBiliBili,
    ownerEmail,
    getOwnerInfo,
  }
})
