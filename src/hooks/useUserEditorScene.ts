// 引入仓库

import { useSettingStore } from "@/store/setting"
export const useUserEditorScene = () => {
  const { isShowPanel, setScene } = storeToRefs(useSettingStore())
  return () => {
    isShowPanel.value = true
    setScene.value = 1
  }
}
