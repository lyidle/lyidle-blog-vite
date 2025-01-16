// 定义滚动方向的类型
type ScrollDirection = "up" | "down" | ""

export const useSettingStore = defineStore(
  "Setting",
  () => {
    // #region 面板相关设置
    // 面板的 显示与隐藏
    const isShowPanel = ref<boolean>(false)
    // 面板的场景
    const setScene = ref<string | number>("0")
    // #endregion 面板相关设置

    // #region 主题的设置
    // 主题选择
    const themeOptions = [
      { value: "light", label: "白天模式" },
      { value: "dark", label: "暗夜模式" },
      { value: "auto", label: "跟随系统" },
      { value: "switch", label: "快捷切换" },
    ]
    // 背景 是否 悬浮
    const bannerIsFixed = ref<boolean>(false)
    // 暗夜切换
    const isDark = ref<boolean>(false)
    // 主题选择
    const themes = ref("light")
    // 白天的主题值
    const lights = ref("normal")
    const lightOptions = [{ value: "normal", label: "纯白" }]
    // 暗夜的主题值
    const darks = ref("normal")
    const darkOptions = [{ value: "normal", label: "深蓝" }]
    // #endregion 头部设置

    // #region 点击特效设置
    // 是否开启 鼠标点击特效
    const clickEffect = ref<boolean>(false)
    // 点击特效 值
    const clicks = ref("normal")
    // 点击特效 选择
    const clickOptions = [{ value: "normal", label: "绽放" }]
    // #endregion 点击特效设置

    // #region 移动特效设置
    // 是否开启 移动效果
    const moveEffect = ref<boolean>(false)
    // 移动特效 的值
    const moves = ref("normal")
    // 移动特效 选择
    const moveOptions = [{ value: "normal", label: "群星" }]
    // #endregion 移动特效设置

    // #region 布局信息设置
    // 侧边栏位置 默认右侧
    const contentIsReverse = ref<boolean>(false)
    // 文章的目录是否固定 默认固定 使用交叉传感器 和 滚动监听
    const docMenuIsFixed = ref<boolean>(true)
    // 是否存储 个性化面板的 位置
    const savePosition = ref<boolean>(true)
    // 存储位置信息
    const initLeft = ref<null | string>(null)
    const initTop = ref<null | string>(null)
    /*  
       禁用布局切换 和 侧边栏 开关
       使用交叉观察器 和 滚动来判断是否要固定
       默认使用的 scroll 因为要 改变布局
    */
    const docMenuIsFixedLazy = ref<boolean>(false)
    // #endregion 布局信息设置

    // 是否全屏
    const isFullScreen = ref<boolean>(false)

    // #region 布局显示与隐藏设置
    // 是否开启侧边栏
    const isAside = ref<boolean>(true)
    // 对应 侧边栏的开关
    const isAsideSelf = ref<boolean>(true)
    const isAsideAnnounce = ref<boolean>(true)
    const isAsideWebInfo = ref<boolean>(true)
    const isAsideRecentPage = ref<boolean>(true)
    const isAsideDocMenu = ref<boolean>(true)
    // 开启的侧边栏个数
    const asideCounts = computed(() => {
      let num: number = 0
      if (isAsideSelf.value) num++
      if (isAsideAnnounce.value) num++
      if (isAsideWebInfo.value) num++
      if (isAsideRecentPage.value) num++
      if (isAsideDocMenu.value) num++
      if (num === 0) isAside.value = false
      return num
    })
    // #endregion 布局显示与隐藏设置

    // #region 存储滚动距离 和 方向
    const scrollTop = ref<number>(0) // 滚动位置

    const direction = ref<ScrollDirection>("") // 滚动方向

    // 更新滚动方向和位置的方法
    const updateScrollDirection = (currentScrollTop: number): void => {
      if (currentScrollTop > scrollTop.value) {
        direction.value = "down"
      } else if (currentScrollTop < scrollTop.value) {
        direction.value = "up"
      }
      scrollTop.value = currentScrollTop
    }
    // #endregion 存储滚动距离 和 方向

    return {
      // 头部设置
      isDark,
      themes,
      themeOptions,
      lights,
      lightOptions,
      darks,
      darkOptions,
      clicks,
      clickOptions,
      moves,
      moveOptions,
      bannerIsFixed,
      clickEffect,
      moveEffect,
      isAside,
      // 文章的目录是否固定
      docMenuIsFixed,
      docMenuIsFixedLazy,
      // 右键菜单 信息
      isFullScreen,
      contentIsReverse,
      // 个性化设置 右键的编辑项
      setScene,
      isShowPanel,
      savePosition,
      initLeft,
      initTop,
      // #region 侧边栏的 显示与否
      asideCounts,
      isAsideSelf,
      isAsideAnnounce,
      isAsideWebInfo,
      isAsideRecentPage,
      isAsideDocMenu,
      // #endregion 侧边栏的 显示与否
      // 存储滚动距离 和 方向
      scrollTop,
      direction,
      updateScrollDirection,
    }
  },
  {
    persist: {
      key: "Setting",
      storage: localStorage,
      pick: [
        // 头部设置信息
        "isDark",
        "themes",
        "themeOptions",
        "lights",
        "darks",
        "clicks",
        "moves",
        "bannerIsFixed",
        "clickEffect",
        "moveEffect",
        "isAside",
        "docMenuIsFixed",
        "docMenuIsFixedLazy",
        // 右键菜单 信息
        "contentIsReverse",
        // 个性化设置 右键的编辑项
        "setScene",
        "savePosition",
        "initLeft",
        "initTop",
        // #region 侧边栏的 显示与否
        "asideCounts",
        "isAsideSelf",
        "isAsideAnnounce",
        "isAsideWebInfo",
        "isAsideRecentPage",
        "isAsideDocMenu",
        // #endregion 侧边栏的 显示与否
      ],
    },
  }
)
