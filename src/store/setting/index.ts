import isDarkFn from "@/utils/isDark"
// 引入仓库
import { useUserStore } from "@/store/user"
// 引入类型
import { menuListType } from "@/api/user/type"
export const useSettingStore = defineStore(
  "Setting",
  () => {
    // 头部字体颜色
    const headerColor = ref<string>("white")
    // 头部背景颜色
    const headerBg = ref<string>("transparent")
    // 大屏头部设置 按钮开关
    const isDark = ref<boolean>(true)
    const setDark = (newV: boolean, route: any) => {
      isDark.value = newV
      isDarkFn(newV)
      setBanner(newV, route)
    }
    // banner相关 变量
    const bannerHeight = ref("")
    const bannerFixed = ref(false)
    // 暗夜切换的bannerImg
    const bannerImg = ref()
    const { menuList } = useUserStore()
    let path: string | null = null
    // 初始化banner 主要是白天黑夜要跟着改变 也可以用watch监听
    const setBanner = (newV: boolean, route: any) => {
      // 初始化 加上缓存处理 如果当前路由没有变动就不初始化
      const init = () => {
        // 有缓存退出
        if (path === route.path) return
        const recursive = (item: menuListType[]) => {
          function multi(item: any) {
            for (let i = 0; i < item.length; i++) {
              const obj = item[i]
              if (obj.to.includes(route.path)) {
                if (obj.bannerImg) {
                  // 也可以弄个中间变量返回 再赋值
                  bannerImg.value = obj.bannerImg
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
        recursive(menuList)
        bannerHeight.value = bannerImg.value?.height
          ? bannerImg.value?.height
          : "100vh"
        bannerFixed.value = bannerImg.value?.fixed || false
        // 缓存本次路由
        path = route.path
      }
      init()
      if (newV) {
        bannerImg.value = bannerImg.value.dark
          ? bannerImg.value.dark
          : "var(--banner-img)"
      } else {
        bannerImg.value = bannerImg.value?.light
          ? bannerImg.value.light
          : "var(--banner-img)"
      }
      return bannerImg
    }
    return {
      // header相关
      headerColor,
      headerBg,
      // 暗夜相关
      isDark,
      setDark,
      // banner相关
      setBanner,
      bannerImg,
      bannerFixed,
      bannerHeight,
    }
  },
  {
    persist: {
      key: "setting",
      storage: localStorage,
      pick: ["isDark"],
    },
  }
)
