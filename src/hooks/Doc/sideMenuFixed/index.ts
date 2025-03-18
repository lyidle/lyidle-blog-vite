// 引入 仓库
import { useSettingStore } from "@/store/setting"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 交叉传感器
import { observer } from "@/utils/observer"
import type { ObserverCallback } from "@/utils/observer"
import { TocNode } from "@/views/doc/review/types"

// 初始化需要的数据
let menuWrap: HTMLDivElement | null = null
let threelastDiv: HTMLDivElement | null = null
let docRef = ref<HTMLDivElement | undefined>()
// 交叉传感器 需要用到的
let sibEnter = true
let sibLeave = true
let threelastOb = ref<ObserverCallback | null>(null)
let thirdlastOb = ref<ObserverCallback | null>(null)
let menuOb = ref<ObserverCallback | null>(null)
let thirdlastDiv: HTMLDivElement | null = null
// 使用 settimout轮询的方式获取 侧边栏 因为一开始并没有加载出来 使用了 v-if
let timer: ReturnType<typeof setInterval> | null
let timoutNum = 0 //初始化的次数 初始0 使用 setinterval 轮询获取节点信息
let timoutMax = 5
let timeoutDur = 2000 // 500ms 一次轮询
export const useSideMenuFixed = (
  menuTree: TocNode[] | undefined,
  observerMenu: HTMLDivElement | undefined,
  menuCom: Ref<HTMLDivElement | undefined>
) => {
  // 提取数据
  const { docMenuIsFixed, asideCounts, isAsideDocMenu } = storeToRefs(
    useSettingStore()
  )
  // 判断是否有菜单要固定
  const isBad = (): boolean => {
    // 判断 是否有菜单数据 是否固定 和 菜单是否存在 还有 侧边栏个数一起判断
    if (
      !menuTree ||
      !docMenuIsFixed.value ||
      !isAsideDocMenu.value ||
      !asideCounts.value ||
      !menuCom.value
    )
      return true
    return false
  }

  // 挂载
  const enterScrollListener = () => {
    // 判断是否有菜单要固定
    if (isBad()) return
    // 要等 组件渲染完毕后 在执行
    // 因为异步 setinterval 需要先把元素 获取到
    initElements(() => {
      // 使用交叉传感器
      intersectListener()
    })
  }

  // 共有的卸载方法
  const globalUnMount = () => {
    timer && clearTimeout(timer)
    threelastOb.value?.stop?.()
    thirdlastOb.value?.stop?.()
    menuOb.value?.stop?.()
  }

  // 卸载
  const unEnterScrollListener = () => {
    globalUnMount()
    // 移除类名
    removeStickyClasses()
    // 初始化存储的值
    menuWrap = null
    threelastDiv = null
    docRef.value = undefined
    timoutNum = 0
    // 交叉传感器 需要用到的
    sibEnter = true
    sibLeave = true
    threelastOb.value = null
    thirdlastOb.value = null
    menuOb.value = null
    thirdlastDiv = null
  }

  // 重载
  const reloadEnterScrollListener = () => {
    // 判断是否有菜单要固定
    if (isBad()) return
    // 重载
    unEnterScrollListener()
    enterScrollListener()
  }

  // 初始化元素
  const initElements = (fn: Function) => {
    // 判断是否有菜单要固定
    if (isBad()) return

    if (!menuWrap) {
      menuWrap = menuCom.value?.parentElement
        ?.parentElement as HTMLDivElement | null
    }

    if (!threelastDiv) {
      const container = menuWrap?.parentElement
      if (container?.children.length === asideCounts.value) {
        if (asideCounts.value !== 1)
          threelastDiv = container?.children[
            container?.children.length - 2
          ] as HTMLDivElement | null
        if (asideCounts.value > 2)
          thirdlastDiv = container?.children[
            container?.children.length - 3
          ] as HTMLDivElement | null
        timer && clearTimeout(timer)
        // 得到节点信息后 执行函数
        fn && fn()
      } else {
        // 判断 轮询次数是否超出
        if (++timoutNum > timoutMax) {
          ElMessage.error("固定目录失败，不能获取到节点信息~")
          return
        }
        // 获取节点 有时候组件没有加载 会出现问题 所以确保的却的获得了 节点信息
        timer = setTimeout(() => {
          // 清除之前的
          timer && clearTimeout(timer)
          initElements(fn)
        }, timeoutDur)
      }
    }
  }

  // 使用 交叉传感器监听
  const intersectListener = () => {
    // 交叉传感器 两个侧边栏的处理方法
    if (asideCounts.value === 2) {
      sideOnlyOneIntersect()
      return
    }
    if (asideCounts.value > 2) {
      // 交叉传感器 两个以上侧边栏的处理方法
      sideManyIntersect()
      return
    }
    // 只有一个菜单时 单独处理
    if (asideCounts.value === 1) {
      handlerOnlyOneSideMenu()
      return
    }
  }

  // 只有 一个目录时
  const handlerOnlyOneSideMenu = () => {
    menuOb.value = {
      enter: () => {
        removeStickyClasses()
      },
      leave: () => {
        toggleMenuPosition()
      },
    }
    if (observerMenu) observer(observerMenu, menuOb.value)
  }

  // 交叉传感器 两个侧边栏的处理方法
  const sideOnlyOneIntersect = () => {
    if (!menuWrap) return

    // 交叉传感器改变布局后 需要固定
    if (menuWrap?.getBoundingClientRect().top < 0) {
      // 重置
      sibEnter = true
      sibLeave = true
      // 固定
      toggleMenuPosition()
    }

    if (threelastDiv) {
      threelastOb.value = {
        enter: () => {
          sibEnter = false
          // 清除
          removeStickyClasses()
        },
        leave: () => {
          sibLeave = false
          if (!sibEnter && !sibLeave) {
            // 重置
            sibEnter = true
            sibLeave = true
            // 固定
            toggleMenuPosition()
          }
        },
      }
      observer(threelastDiv, threelastOb.value)
    }
  }

  // 交叉传感器 两个以上侧边栏的处理方法
  // 不需要 处理改变布局的事情 因为 两个以上的离开后就是 固定的方法
  const sideManyIntersect = () => {
    if (thirdlastDiv && threelastDiv) {
      threelastOb.value = {
        leave: (entry) => {
          if (entry.boundingClientRect.bottom < 0) toggleMenuPosition()
        },
        enter: (entry) => {
          if (entry.boundingClientRect.top < 0) removeStickyClasses()
        },
      }
      thirdlastOb.value = {
        leave: () => {
          if (threelastDiv && threelastOb.value)
            observer(threelastDiv, threelastOb.value)
        },
      }
      observer(thirdlastDiv, thirdlastOb.value)
    }
  }

  // 添加类名
  const toggleMenuPosition = () => {
    if (!menuWrap) return
    nextTick(() => {
      if (!menuWrap || !observerMenu) return
      // 读取相邻的 内容区域 的 observerMenu 节点信息

      // 因为有可能元素本身是固定的
      const _left = observerMenu.getBoundingClientRect().left

      if (_left > 100) {
        // 菜单栏在左侧
        menuWrap.classList.add("aside-menu-sticky-left")
        menuWrap.classList.remove("aside-menu-sticky-right")
      } else {
        // 菜单栏在右侧
        menuWrap.classList.add("aside-menu-sticky-right")
        menuWrap.classList.remove("aside-menu-sticky-left")
      }
    })
  }

  // 移除类名
  const removeStickyClasses = () => {
    if (menuWrap) {
      menuWrap.classList.remove("aside-menu-sticky-right")
      menuWrap.classList.remove("aside-menu-sticky-left")
    }
  }

  watchEffect(() => {
    // 判断是否有菜单要固定
    if (isBad()) {
      unEnterScrollListener()
      return
    }
    // 判断是否 有数据
    if (menuTree?.length) {
      enterScrollListener()
    } else unEnterScrollListener()
  })

  // 侧边栏数量变化
  const countsVariable = () => {
    if (asideCounts.value >= 1) {
      reloadEnterScrollListener()
    }
  }

  // 订阅 布局切换 事件
  mitt.on("contentIsReverse", reloadEnterScrollListener)
  mitt.on("isAside:true", reloadEnterScrollListener)
  // 订阅 数量变化 事件
  mitt.on("asideCounts", countsVariable)

  onBeforeUnmount(() => {
    globalUnMount()
    // 取消订阅 布局切换 事件
    mitt.off("contentIsReverse", reloadEnterScrollListener)
    mitt.off("isAside:true", reloadEnterScrollListener)
    // 取消订阅 数量变化 事件
    mitt.off("asideCounts", countsVariable)
  })
}
