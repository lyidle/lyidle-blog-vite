export const useManagerStore = defineStore(
  "Manager",
  () => {
    const isFold = ref<boolean>(false)
    const autoFold = ref<boolean>(true)
    return {
      isFold,
      autoFold,
    }
  },
  {
    persist: {
      key: "Manager",
      storage: localStorage,
      pick: ["autoFold"],
    },
  }
)
