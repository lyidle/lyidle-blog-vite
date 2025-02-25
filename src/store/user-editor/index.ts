export const useUserEditorStore = defineStore(
  "UserEditor",
  () => {
    return {}
  },
  {
    persist: {
      key: "UserEditor",
      storage: localStorage,
      pick: [],
    },
  }
)
