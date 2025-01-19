/**
 * 提供工具栏动画的逻辑，包括进入和离开的动画效果。
 *
 * @param settings - 一个 `Ref` 对象，引用需要应用动画的 HTMLDivElement 元素。
 * @param timeout - 动画的超时时间（单位：毫秒），默认为 500 毫秒。
 * @returns 一个对象，包含两个方法 `settingsEnter` 和 `settingsLeave`，用于触发进入和离开动画。
 *
 */
export const useSettingsAnimation = (
  settings: Ref<HTMLDivElement | undefined>,
  timeout = 500
) => {
  let timer: ReturnType<typeof setTimeout> | null = null // 定时器引用

  /**
   * 工具栏进入动画
   */
  const settingsEnter = (): void => {
    if (!settings.value) return

    // 清除可能存在的离开定时器
    if (timer) {
      clearTimeout(timer)
      timer = null
    }

    // 设置进入动画
    settings.value.style.transform = "translateX(0%)"
  }

  /**
   * 工具栏离开动画
   */
  const settingsLeave = (): void => {
    if (!settings.value) return

    // 设置离开动画
    settings.value.style.transform = "translateX(150%)"

    // 设置一个定时器，确保在超时后确认离开逻辑
    timer = setTimeout(() => {
      // 离开动画完成
    }, timeout)
  }

  return { settingsEnter, settingsLeave }
}
