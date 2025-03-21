// 引入api
import { getAnnounce } from "@/api/admin"
import type { GetAnnounce } from "@/api/admin/types/getAnnounce"
// 只发起 一次的 请求 公告
export const useAnnounceStore = defineStore(
  "Announce",
  () => {
    // 公告
    // 展示的数据
    const announce = ref<GetAnnounce["data"]["announce"]>()
    const region_city = ref<string | null>()
    const region_country = ref<string | null>()
    const region_province = ref<string | null>()
    const region_userIp = ref<string | null>()

    // 发起请求
    const reqAnnounce = async () => {
      try {
        const result = await getAnnounce()
        announce.value = result.announce
        // 设置 region 的值
        region_city.value = result.region?.city
        region_country.value = result.region?.country
        region_province.value = result.region?.province
        region_userIp.value = result.region?.userIp
      } catch (error) {
        console.warn("获取公告失败", error)
      }
    }

    return {
      reqAnnounce,
      // 展示的数据
      announce,
      region_city,
      region_country,
      region_province,
      region_userIp,
    }
  },
  {
    persist: {
      key: "Announce",
      storage: localStorage,
      pick: [
        "announce",
        "region_city",
        "region_country",
        "region_province",
        "region_userIp",
      ],
    },
  }
)
