// 引入api
import { getWebInfo } from "@/api/admin"
// 引入计数 转换函数
import numberTransform from "@/utils/numberTransform"
import moment from "@/utils/moment"
export const useWebInfoStore = defineStore("WebInfo", () => {
  // 显示的数据
  const webTotalPages = ref<string>()
  const webUserCounts = ref<string>()
  const touristCounts = ref<string>()
  const webTotalPersonCounts = ref<string>()
  const webCreatedAt = ref<ReturnType<typeof moment> | string>()
  const webUpdatedAt = ref<ReturnType<typeof moment> | string>()
  const webTotalWords = ref<string>()

  // 判断是否有数据 显示和隐藏小站咨询
  const isDataShow = computed(() => {
    return (
      webTotalPages.value ||
      webTotalWords.value ||
      webUserCounts.value ||
      touristCounts.value ||
      webTotalPersonCounts.value ||
      webCreatedAt.value ||
      webUpdatedAt.value
    )
  })

  // 发起请求
  const reqWebInfo = async () => {
    // 可以缓存处理以下
    // if (webTotalPages.value) return
    // console.log("获取网站咨询~")
    const {
      webTotalPages: totalPages,
      webUserCounts: userCounts,
      touristCounts: tourists,
      webTotalPersonCounts: totalPersonCounts,
      webCreatedAt: createdAt,
      webUpdatedAt: updatedAt,
      totalWordsData,
    } = await getWebInfo()
    // 整理参数
    if (totalPages) webTotalPages.value = numberTransform(totalPages)
    else webTotalPages.value = ""
    if (userCounts) webUserCounts.value = numberTransform(userCounts)
    else webUserCounts.value = ""
    if (tourists) touristCounts.value = numberTransform(tourists)
    else touristCounts.value = ""
    if (totalPersonCounts)
      webTotalPersonCounts.value = numberTransform(totalPersonCounts)
    else ""
    if (createdAt) webCreatedAt.value = moment(createdAt)
    else webCreatedAt.value = ""
    if (updatedAt) webUpdatedAt.value = moment(updatedAt)
    else webUpdatedAt.value = ""
    let words = 0
    if (totalWordsData)
      for (let i = 0; i < totalWordsData.length; i++) {
        const item = totalWordsData[i]
        if (item.UserInfo?.totalWords)
          words += Number(item.UserInfo?.totalWords)
      }
    if (words) webTotalWords.value = numberTransform(words)
    else webTotalWords.value = ""
  }

  return {
    reqWebInfo,
    webTotalPages,
    webUserCounts,
    touristCounts,
    webTotalPersonCounts,
    webCreatedAt,
    webUpdatedAt,
    webTotalWords,
    isDataShow,
  }
})
