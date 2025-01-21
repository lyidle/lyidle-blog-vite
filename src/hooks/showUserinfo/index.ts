// 引入仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
// 引入仓库
export const useShowUserinfo = () => {
  // 提取需要的数据
  const {
    // 用户信息
    userAccount,
    userNickName,
    userAvatar,
    userSigner,
    userToken,
    userPages,
    userTags,
    userCategories,
  } = storeToRefs(useUserStore())

  const {
    // 管理员信息，用于展示未登录的默认信息
    adminAccount,
    adminNickName,
    adminAvatar,
    adminSigner,
    adminPages,
    adminTags,
    adminCategories,
  } = storeToRefs(useOwnerStore())

  // 定义展示用的数据
  const showAccount = computed(() =>
    userToken.value ? userAccount.value : adminAccount.value
  )
  const showNickName = computed(() =>
    userToken.value ? userNickName.value : adminNickName.value
  )
  const showAvatar = computed(() => {
    const avatar = userToken.value ? userAvatar.value : adminAvatar.value
    return avatar || "var(--default-avatar)" // 判断是否有值，无值返回默认值
  })
  const showSigner = computed(() =>
    userToken.value ? userSigner.value : adminSigner.value
  )
  const showPages = computed(() =>
    userToken.value ? userPages.value : adminPages.value
  )
  const showTags = computed(() =>
    userToken.value ? userTags.value : adminTags.value
  )
  const showCategories = computed(() =>
    userToken.value ? userCategories.value : adminCategories.value
  )

  // 用于判断是否存在 用户 服务器 可能没有 用户和admin
  const isAccount = computed(() => {
    if (userToken.value || adminAccount.value) return true
    return false
  })

  // 返回展示用的 computed 数据
  return {
    showAccount,
    showNickName,
    showAvatar,
    showSigner,
    showPages,
    showTags,
    showCategories,
    isAccount,
  }
}
