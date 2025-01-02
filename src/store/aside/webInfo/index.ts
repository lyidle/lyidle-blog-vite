// 引入api
import { getWebInfo } from "@/api/webInfo"
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
      webTotalWords: totalWords,
    } = await getWebInfo()

    // 整理参数
    if (totalPages) webTotalPages.value = numberTransform(totalPages)
    if (userCounts) webUserCounts.value = numberTransform(userCounts)
    if (tourists) touristCounts.value = numberTransform(tourists)
    if (totalPersonCounts)
      webTotalPersonCounts.value = numberTransform(totalPersonCounts)
    if (createdAt) webCreatedAt.value = moment(createdAt)
    if (updatedAt) webUpdatedAt.value = moment(updatedAt)
    if (totalWords) webTotalWords.value = numberTransform(totalWords)
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
  }
})
