// 引入api
import { getAnnounce } from "@/api/admin"
import { getRecentPages } from "@/api/article"
import type { GetRecentPages } from "@/api/article/types/getRecentPages"
export const useAnnounceAndRecentPagesStore = defineStore(
  "AnnounceAndRecentPages",
  () => {
    // 公告
    // 展示的数据
    const announce = ref<string>()
    // 发起请求
    const reqAnnounce = async () => {
      const result = await getAnnounce()
      announce.value = result.announce
      try {
        await reqAnnounce()
      } catch (error) {
        ElMessage.error(error as string)
      }
    }

    // 最新文章
    //  展示的数据
    const pages = ref<GetRecentPages["data"] | null>()
    // 发起请求
    const reqRecentPages = async () => {
      try {
        pages.value = await getRecentPages()
      } catch (error) {
        pages.value = null
        ElMessage.error(error as string)
      }
    }

    return { reqAnnounce, announce, pages, reqRecentPages }
  }
)
