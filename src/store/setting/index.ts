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
    const contentIsReverse = ref<boolean>()
    // #endregion 头部设置

    // #region banner
    // banner相关 变量
    const bannerHeight = ref("")
    const route = useRoute()
    let path: string | null = null
    // 暗夜切换的bannerImg
    const bannerImg = computed(() => {
      let result: any
      // 初始化 加上缓存处理 如果当前路由没有变动就不初始化
      const init = () => {
        // 有缓存退出
        if (path === route?.path) return
        const recursive = (item: menuListType[]) => {
          function multi(item: any) {
            for (let i = 0; i < item.length; i++) {
              const obj = item[i]
              if (obj.to?.includes(route.path)) {
                if (obj.bannerImg) {
                  result = obj.bannerImg
                  return
                }
              }
              if (obj.children) {
                return multi(obj.children)
              }
            }
          }
          // 递归找到深层路径中包含当前路径的对象返回oneId
          multi(item)
        }
        recursive(menuList.value)
        bannerHeight.value = result?.height ? result?.height : "100vh"
        // 缓存本次路由
        path = route.path
      }
      init()
      if (isDark.value) {
        result = result?.dark ? result.dark : "var(--banner-img)"
      } else {
        result = result?.light ? result.light : "var(--banner-img)"
      }
      return result
    })
    const { menuList } = storeToRefs(useUserStore())
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
      key: "setting",
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
