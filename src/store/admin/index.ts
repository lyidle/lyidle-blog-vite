export const useMenuListStore = defineStore(
  "Admin",
  () => {
    const test = ref<number>(0)
    const test2 = ref<number>(0)
    return { test, test2 }
  },
  {
    persist: [
      {
        key: "admin",
        storage: localStorage,
        pick: ["test"],
      },
      {
        key: "admin",
        storage: sessionStorage,
        pick: ["test2"],
      },
    ],
  }
)
