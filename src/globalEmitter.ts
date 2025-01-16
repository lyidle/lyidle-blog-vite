// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入 mitt
import { mitt } from "@/utils/emitter"
// 引入 类型
import type { effectReturnType } from "@/utils/effect"
import type { EmitterEvents } from "@/utils/emitter"

// 鼠标事件存储
let clickEventStore: effectReturnType | null = null
let moveEventStore: null | effectReturnType = null

// 移动事件的回调
const moveCb: EmitterEvents["moveEffect:normal"] = ($moveEventStore) => {
  moveEventStore = $moveEventStore
}

// 点击事件的回调
const clickCb: EmitterEvents["clickEffect:normal"] = ($clickEventStore) => {
  clickEventStore = $clickEventStore
}
// 暴露 全局的 emitter
export const useGlobalEmitter = () => {
  // 提取数据
  const {
    isDark,
    themes,
    clickEffect,
    moveEffect,
    bannerIsFixed,
    clicks,
    moves,
    contentIsReverse,
    docMenuIsFixedLazy,
    isAside,
    asideCounts,
    isShowPanel,
  } = storeToRefs(useSettingStore())

  onMounted(() => {
    // 监听 布局切换事件
    watch(
      () => contentIsReverse.value,
      () => {
        mitt.emit("contentIsReverse")
      }
    )

    // 监听侧边栏的个数变化
    watch(
      () => asideCounts.value,
      () => {
        mitt.emit("asideCounts")
      }
    )

    // 监听 菜单关闭与隐藏
    watch(
      () => isAside.value,
      (newV) => {
        newV && mitt.emit("isAside")
      }
    )

    // 监听 themes
    watch(
      () => themes.value,
      () => {
        mitt.emit("themes")
      },
      {
        immediate: true,
      }
    )

    // 监听 isDark
    watch(
      () => isDark.value,
      () => {
        // 统一触发
        mitt.emit("isDark")
      },
      {
        immediate: true,
      }
    )

    // 监听 bannerIsFixed
    watch(
      () => bannerIsFixed.value,
      (newV) => {
        newV && mitt.emit("bannerIsFixed:true")
        !newV && mitt.emit("bannerIsFixed:false")
      },
      {
        immediate: true,
      }
    )
    // 监听 clickEffect
    watch(
      () => clickEffect.value,
      (newVal) => {
        watch(
          () => clicks.value,
          (newV) => {
            // 卸载其他 点击特效
            clickEventStore && clickEventStore.onUnMounted()
            if (newV === "normal") {
              mitt.emit("clickEffect:normal", clickCb)
            }
          },
          {
            immediate: true,
          }
        )
      },
      {
        immediate: true,
      }
    )

    // 监听 moveEffect
    watch(
      () => moveEffect.value,
      (newVal) => {
        watch(
          () => moves.value,
          (newV) => {
            // 卸载其他 点击特效
            moveEventStore && moveEventStore.onUnMounted()
            if (newV === "normal") {
              mitt.emit("moveEffect:normal", moveCb)
            }
          },
          {
            immediate: true,
          }
        )
      },
      {
        immediate: true,
      }
    )

    // 监听 docMenuIsFixedLazy
    /*  
    禁用布局切换 和 侧边栏 开关
    使用交叉观察器 和 滚动来判断是否要固定
    默认使用的 scroll 因为要 改变布局
*/
    watch(
      () => docMenuIsFixedLazy.value,
      (newV) => {
        window.location.reload()
      }
    )

    // 监听 面板 显示与隐藏
    watch(
      () => isShowPanel.value,
      (newV) => {
        mitt.emit("isShowPanel")
        if (newV) {
          mitt.emit("isShowPanel:true")
        } else {
          mitt.emit("isShowPanel:false")
        }
      }
    )
  })
}
