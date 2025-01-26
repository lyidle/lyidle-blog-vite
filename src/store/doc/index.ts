export const useDocEditorOpt = defineStore(
  "docEditorOptStore",
  () => {
    // 配置信息
    // 高度
    const docHeight = ref<number | string>("85vh")
    // 内容
    const context = ref<string>()
    // 标题
    const title = ref<string>()
    // 分类
    const category = ref<string>()
    // 标签
    const tags = ref<string[]>(["Tag 1", "Tag 2", "Tag 3"])
    // 描述
    const desc = ref<string>()
    // 长度
    const length = ref<number | string>()
    return {
      docHeight,
      context,
      title,
      category,
      tags,
      desc,
      length,
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
      ],
    },
  }
)
