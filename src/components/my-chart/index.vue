<template>
  <div ref="chartInstance" class="w-100% h-400px"></div>
</template>

<script setup lang="ts" name="MyChart">
// 引入 echart
import { echart } from "@/utils/echart"
// 引入 类型
import type { ECElementEvent, EChartsType } from "echarts/core"
import type { ECOption } from "@/utils/echart"
const option = defineModel<ECOption>()
const props = defineProps<{ click?: (params: ECElementEvent) => void }>()
watch(
  () => option.value,
  (newV) => {
    // 有 配置对象了 挂载
    if (newV) {
      // 销毁旧的 chart
      myChart?.dispose()
      eCharts()
    }
  },
  { deep: true }
)

// echart 容器
const chartInstance = ref()
// chart 实列
let myChart: EChartsType | undefined

const eCharts = () => {
  // 没有配置项退出
  if (!option.value) return
  // 基于准备好的dom，初始化echarts实例
  myChart = echart.init(chartInstance.value)
  // 使用指定的配置项和数据显示图表。
  myChart.setOption(option.value)
  // 监听点击事件
  if (props.click instanceof Function)
    myChart.on("click", (params) => {
      if (props.click instanceof Function) props.click(params)
    })
}

// 挂载
onMounted(() => {
  eCharts()
})
// 销毁
onBeforeUnmount(() => {
  myChart?.dispose()
})
</script>
