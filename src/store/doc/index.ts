// 引入 类型
import { uploadFiles } from "@/components/my/upload/index.vue"

export const useDocEditorOpt = defineStore(
  "docEditorOpt",
  () => {
    // 配置信息
    // 高度
    const docHeight = ref<string>("85vh")
    // 内容
    const context = ref<string>("")
    // 标题
    const title = ref<string>()
    // 分类
    const category = ref<string>()
    // 标签
    const tags = ref<string[]>([])
    // 描述
    const desc = ref<string>()
    // 长度
    const length = ref<number>(0)
    // 海报
    const poster = ref<uploadFiles>([])
    return {
      docHeight,
      context,
      title,
      category,
      tags,
      desc,
      length,
      poster,
    }
  },
  {
    persist: {
      key: "docEditorOpt",
      storage: localStorage,
      pick: [
        "docHeight",
        "context",
        "title",
        "category",
        "tags",
        "desc",
        "length",
        "poster",
      ],
    },
  }
)
