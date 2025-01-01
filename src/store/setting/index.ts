export const useSettingStore = defineStore(
  "Setting",
  () => {
    // #region 头部设置
    // 是否暗夜模式
    const isDark = ref<boolean>(true)
    // banner 是否 固定
    const bannerIsFixed = ref<boolean>(false)
    // 是否开启鼠标点击特效
    const clickEffect = ref<boolean>(false)
    // 是否开启移动效果
    const moveEffect = ref<boolean>(false)
    // 是否开启侧边栏
    const isAside = ref<boolean>(true)
    // #endregion 头部设置

    // 菜单信息
    // 是否全屏
    const isFullScreen = ref<boolean>(false)
    // 内容区域和侧边信息是否交换
    const contentIsReverse = ref<boolean>(false)

    return {
      // 头部设置
      isDark,
      bannerIsFixed,
      clickEffect,
      moveEffect,
      isAside,
      // 右键菜单 信息
      isFullScreen,
      contentIsReverse,
    }
  },
  {
    persist: {
      key: "Setting",
      storage: localStorage,
      pick: [
        // 头部设置信息
        "isDark",
        "bannerIsFixed",
        "clickEffect",
        "moveEffect",
        "isAside",
        // 右键菜单 信息
        "contentIsReverse",
        "isFullScreen",
      ],
    },
  }
)
