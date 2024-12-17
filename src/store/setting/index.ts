import isDarkFn from "@/utils/isDark"
// 引入仓库
import { useUserStore } from "@/store/user"
// 引入类型
import { menuListType } from "@/api/user/type"
// 引入鼠标点击和移动特效
import { clickEffectFn, moveEffectFn } from "@/utils/effect"
export const useSettingStore = defineStore(
  "Setting",
  () => {
    // 头部字体颜色
    const headerColor = ref<string>("white")
    // 头部背景颜色
    const headerBg = ref<string>("transparent")

    // #region 头部设置
    const isDark = ref<boolean>(true)
    const setDark = (newV: boolean) => {
      // 暗夜模式
      isDark.value = newV
      isDarkFn(newV)
    }
    // banner 是否 固定
    const bannerIsFixed = ref<boolean>(false)
    const setBannerFixed = (newV: boolean) => {
      bannerIsFixed.value = newV
    }
    // 是否开启鼠标点击特效
    const clickEffect = ref<boolean>(false)
    //调用特效函数
    const effectClick = new clickEffectFn()
    const effectMove = new moveEffectFn()
    const setClickEffect = (newV: boolean = clickEffect.value) => {
      clickEffect.value = newV
      if (newV) {
        effectClick.onMounted()
      } else {
        effectClick.onUnMounted()
      }
    }
    // 是否开启移动效果
    const moveEffect = ref<boolean>(false)
    const setEffectMove = (newV: boolean = moveEffect.value) => {
      moveEffect.value = newV
      if (newV) {
        effectMove.onMounted()
      } else {
        effectMove.onUnMounted()
      }
    }
    // 是否开启侧边栏
    const isAside = ref<boolean>(true)
    // 是否全屏
    const isFullScreen = ref<boolean>(false)
    // 内容区域和侧边信息是否交换
    const contentIsReverse = ref<boolean>(false)
    // #endregion 头部设置
    // #region banner
    // 路由菜单
    const { menuList } = storeToRefs(useUserStore())
    const route = useRoute()
    // 缓存当前路径
    let path: string | null = null
    const banner = computed(() => {
      // 包含当前路径退出
      if (path && (path as string).includes(route.path)) return
      let result: menuListType
      const recursive = (item: menuListType[]) => {
        const multi = (item: any) => {
          for (let i = 0; i < item.length; i++) {
            const obj = item[i]
            if (obj.to?.includes(route.path)) {
              result = obj
              return
            }
            if (obj.children) {
              return multi(obj.children)
            }
          }
        }
        multi(item)
      }
      recursive(menuList.value)
      // @ts-ignore
      return result
    })
    const bannerHeight = computed(() => banner.value?.bannerImg?.height)
    const bannerImg = computed(() => {
      if (isDark.value) {
        return banner.value?.bannerImg?.dark
          ? banner.value?.bannerImg?.dark
          : "var(--banner-img)"
      } else {
        return banner.value?.bannerImg?.light
          ? banner.value?.bannerImg?.light
          : "var(--banner-img)"
      }
    })
    // #endregion banner

    // #region 内容区域
    // 卡片的阴影
    const cardBoxShadow = computed(() => {
      // 内容卡片阴影
      if (bannerIsFixed.value) {
        return "var(--pages-shadow-fixed)"
      } else {
        return "var(--pages-shadow)"
      }
    })
    // #endregion 内容区域

    return {
      // header相关
      headerColor,
      headerBg,
      // 头部设置
      isDark,
      setDark,
      bannerIsFixed,
      setBannerFixed,
      clickEffect,
      setClickEffect,
      moveEffect,
      setEffectMove,
      isAside,
      // banner相关
      banner,
      bannerImg,
      bannerHeight,
      // 内容区域
      cardBoxShadow,
      // other 右键菜单
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
        // 内容区域
        "cardBoxShadow",
        // other 右键菜单
        "contentIsReverse",
      ],
    },
  }
)
