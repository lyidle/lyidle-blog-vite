export const useManagerStore = defineStore(
  "Manager",
  () => {
    const isFold = ref<boolean>(false)
    return {
      isFold,
    }
  },
  {
    persist: {
      key: "Manager",
      storage: localStorage,
      pick: ["isFold"],
    },
  }
)
