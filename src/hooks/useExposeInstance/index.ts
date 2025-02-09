export function useExposeInstance(
  instance: Ref<any>,
  filter?: (key: string, value: any) => boolean
) {
  const exposed = reactive<{ [key in string]: any }>({})

  onMounted(() => {
    if (instance.value) {
      for (const key in instance.value) {
        if (Object.prototype.hasOwnProperty.call(instance.value, key)) {
          const value = instance.value[key]
          // 如果提供了 filter 函数，则根据 filter 的返回值决定是否暴露
          if (!filter || filter(key, value)) {
            exposed[key] = value
          }
        }
      }
    }
  })

  return {
    exposed, // 返回需要暴露的对象
  }
}
