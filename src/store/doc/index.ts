export const useDocEditorOpt = defineStore(
  "docEditorOptStore",
  () => {
    // 配置信息
    const docHeight = ref<number | string>("85vh")
    return {
      docHeight,
    }
  },
  {
    persist: {
      key: "docEditorOpt",
      storage: localStorage,
      pick: ["docHeight"],
    },
  }
)
