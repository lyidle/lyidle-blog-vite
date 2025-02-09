<template>
  <layout-content>
    <template #content-start>
      <my-card class="card_style allCategories">
        <div class="flex justify-center">
          <h1 class="cur-text w-fit">{{ $route.meta.title }}(只显示10个)</h1>
        </div>
        <my-chart
          v-model="pieOption"
          class="mb-40px"
          :click="handlerPie"
        ></my-chart>
        <!-- 词海 -->
        <div class="flex justify-center">
          <h1 class="cur-text w-fit">{{ $route.meta.title }}(词海)</h1>
        </div>
        <div class="cloud-words-container">
          <div class="item" v-for="(key, value) in categories" :key="value">
            <router-link
              class="cloud-words block"
              :style="{
                color: randomColor(),
              }"
              :to="`/user/tags?author=${author}&category=${value}`"
            >
              <span :style="{ fontSize: calculateFontSize(key) + 'px' }">{{
                value
              }}</span>
              <sup class="">{{ key }}</sup>
            </router-link>
          </div>
        </div>
      </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="FindAllUserCategories">
// 引入 接口
import { getCategoriesAll } from "@/api/article"
// 引入 随机颜色函数 和大小计算函数
import { calculateFontSize, randomColor } from "@/utils/Style"
// 导入类型
import type { ECElementEvent } from "echarts/core"

const route = useRoute()
const router = useRouter()

// 得到作者
const { author } = route.params as { author: string }

// 存储所有tags
const categories = ref<{ [key in string]: number }>()

// chart 配置对象
const pieOption = ref()

// chart pie 配置 只显示10个分类的 多了太密
const setPieOption = () => {
  const category = categories.value
  // 不存在退出
  if (!category) return

  // 处理 成功 chart 能够识别的格式
  const legendData = Object.keys(category).slice(1, 10)
  const seriesData = legendData.map((item) => ({
    name: item,
    value: category[item],
  }))

  pieOption.value = {
    title: {
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      left: "center",
      top: "bottom",
      data: legendData,
    },
    series: [
      {
        name: route.meta.title,
        type: "pie",
        radius: [30, 120],
        center: ["50%", "40%"],
        roseType: "area",
        itemStyle: {
          borderRadius: [10, 15],
        },
        data: seriesData,
      },
    ],
  }
}

// 点击 饼图的事件 跳转分类
const handlerPie = (params: ECElementEvent) => {
  if (params.seriesType === "pie") {
    router.push(`/user/tags?author=${author}&category=${params.name}`)
  }
}

// 挂载
onMounted(async () => {
  try {
    // 发起请求
    const result = await getCategoriesAll(author)
    // 得到 categories
    categories.value = result
    // 更新 chart 配置
    setPieOption()
  } catch (error) {}
})
</script>

<style scoped lang="scss">
// 设置 卡片 样式
@include setCardStyle;
// 设置 词海
@include cloud-words;
</style>
