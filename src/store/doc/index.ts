export const useDocEditorOpt = defineStore(
  "docEditorOptStore",
  () => {
    // 配置信息
    // 高度
    const docHeight = ref<number | string>("85vh")
    const context = ref<string>()
    return {
      docHeight,
      context,
    }
  },
  {
    persist: {
      key: "docEditorOpt",
      storage: localStorage,
      pick: ["docHeight", "context"],
    },
  }
)
