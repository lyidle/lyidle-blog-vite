export const useSettingStore = defineStore("Setting", () => {
  const headerColor = ref("white")
  const headerBg = ref("transparent")
  return { headerColor, headerBg }
})
