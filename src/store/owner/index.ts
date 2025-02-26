// 引入 api
import { searchCounts } from "@/api/user"
import { findOneSetting } from "@/api/admin"
// 引入 类型
import { Content as InfoContent } from "@/api/admin/types/Contact Info"
export const useOwnerStore = defineStore("Owner", () => {
  // admin 信息
  const adminAccount = ref<string>("")
  const adminNickName = ref<string>("")
  const adminAvatar = ref<string | null>(null)
  const adminSigner = ref<string | null>(null)
  const adminPages = ref<number>(0)
  const adminTags = ref<number>(0)
  const adminCategories = ref<number>(0)
  // 网站设置信息
  const ownerWeChat = ref<string>("")
  const ownerQQ = ref<string>("")
  const ownerBiliBili = ref<string>("")
  const ownerEmail = ref<string>("")

  // 重置 用户信息
  const resetUserInfo = () => {
    // admin 信息
    adminAccount.value = ""
    adminNickName.value = ""
    adminAvatar.value = null
    adminSigner.value = null
    adminPages.value = 0
    adminTags.value = 0
    adminCategories.value = 0
  }

  // 重置 联系方式
  const resetOwnerInfo = () => {
    ownerWeChat.value = ""
    ownerQQ.value = ""
    ownerEmail.value = ""
    ownerBiliBili.value = ""
  }

  // 发起请求
  const getAdminUserInfo = async () => {
    // 先重置 用户信息
    resetUserInfo()
    try {
      const adminResult = await searchCounts({ roles: "owner", isBin: "true" })

      if (Array.isArray(adminResult)) {
        adminAccount.value = adminResult?.[0]?.account
        adminNickName.value = adminResult?.[0]?.nickName
        adminAvatar.value = adminResult?.[0]?.avatar || null
        adminSigner.value = adminResult?.[0]?.signer || null

        adminPages.value = adminResult?.[0].counts.pages
        adminTags.value = adminResult?.[0].counts.tags
        adminCategories.value = adminResult?.[0].counts.categories
      }
    } catch (error) {}
  }

  // 获取设置里的联系方式
  const getOwnerInfo = async () => {
    // 先重置 联系方式
    resetOwnerInfo()
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
    resetUserInfo,
  }
})
