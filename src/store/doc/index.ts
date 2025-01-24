export const useDocEditorOpt = defineStore(
  "docEditorOptStore",
  () => {
    // 配置信息
    // 高度
    const docHeight = ref<number | string>("85vh")
    // 内容
    const context = ref<string>()
    // 标题
    const title = ref()
    // 分类
    const category = ref()
    // 标签
    const tags = ref(["Tag 1", "Tag 2", "Tag 3"])
    // 描述
    const desc = ref()
    return {
      docHeight,
      context,
      title,
      category,
      tags,
      desc,
    }
  },
  {
    persist: {
      key: "docEditorOpt",
      storage: localStorage,
      pick: ["docHeight", "context", "title", "category", "tags", "desc"],
    },
  }
)
