// 引入 仓库
import { useUserStore } from "@/store/user"
import { useOwnerStore } from "@/store/owner"
// 处理 url
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"

// 定义选项类型
type UseShowUserinfoOptions = {
  showAccount?: boolean
  showNickName?: boolean
  showAvatar?: boolean
  showSigner?: boolean
  showPages?: boolean
  showTags?: boolean
  showCategories?: boolean
  isAccount?: boolean
  showIsBin?: boolean
}

// 主函数
export const useShowUserinfo = (options: UseShowUserinfoOptions = {}) => {
  // 提取需要的数据
  const {
    userAccount,
    userNickName,
    userAvatar,
    userSigner,
    userToken,
    userPages,
    userTags,
    userCategories,
    userIsBin,
  } = storeToRefs(useUserStore())

  const {
    adminAccount,
    adminNickName,
    adminAvatar,
    adminSigner,
    adminPages,
    adminTags,
    adminCategories,
  } = storeToRefs(useOwnerStore())

  // 定义一个函数来安全地创建 computed，如果选项中未启用，则返回 undefined
  const createComputed = <T>(
    key: keyof UseShowUserinfoOptions,
    fn: () => T
  ) => {
    return options[key] ? computed(fn) : undefined
  }

  // 根据传入的 options 动态计算
  const showAccount = createComputed("showAccount", () => {
    return userToken.value ? userAccount.value : adminAccount.value
  })

  const showIsBin = createComputed("showIsBin", () => {
    return userToken.value && userIsBin.value
  })

  const showNickName = createComputed("showNickName", () =>
    userToken.value ? userNickName.value : adminNickName.value
  )

  const showAvatar = createComputed("showAvatar", () => {
    const avatar = userToken.value ? userAvatar.value : adminAvatar.value
    return avatar
      ? `url("${escapeUrlForRegExp(avatar)}")`
      : "var(--default-avatar)" // 判断是否有值，无值返回默认值
  })

  const showSigner = createComputed("showSigner", () =>
    userToken.value ? userSigner.value : adminSigner.value
  )

  const showPages = createComputed("showPages", () =>
    userToken.value ? userPages.value : adminPages.value
  )

  const showTags = createComputed("showTags", () =>
    userToken.value ? userTags.value : adminTags.value
  )

  const showCategories = createComputed("showCategories", () =>
    userToken.value ? userCategories.value : adminCategories.value
  )

  const isAccount = createComputed("isAccount", () => {
    return !!(userToken.value || adminAccount.value)
  })

  // 返回启用的 computed 数据
  return {
    showAccount,
    showNickName,
    showAvatar,
    showSigner,
    showPages,
    showTags,
    showCategories,
    isAccount,
    showIsBin,
  }
}
