<template>
  <layout-content>
    <template #content-start>
      <my-card class="card_style allTags">
        <div class="flex justify-center">
          <h1 class="cur-text w-fit">{{ $route.meta.title || "标签总览" }}</h1>
        </div>
        <!-- 词海 -->
        <div
          class="cloud-words-container"
          v-if="tags && Object.keys(tags).length"
        >
          <div class="item" v-for="(key, value) in tags" :key="value">
            <router-link
              class="cloud-words block"
              :style="{
                color: randomColor(),
              }"
              :to="`/user/categories?author=${author}&category=${value}`"
            >
              <span :style="{ fontSize: calculateFontSize(key) + 'px' }">{{
                value
              }}</span>
              <sup class="">{{ key }}</sup>
            </router-link>
          </div>
        </div>
        <my-empty v-else />
      </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="FindAllUserTags">
// 引入 接口
import { getTagsAll } from "@/api/article"
// 引入 随机颜色函数 和大小计算函数
import { calculateFontSize, randomColor } from "@/utils/Style"

// 得到作者
const route = useRoute()
const { author } = route.params as { author: string }

// 存储所有 tags
const tags = ref<{ [key in string]: number }>()

// 挂载
onMounted(async () => {
  try {
    // 发起请求
    const result = await getTagsAll(author)
    // 得到 tags
    tags.value = result
  } catch (error) {
    ElMessage.error("获取用户的所有标签失败~")
  }
})
</script>

<style scoped lang="scss">
// 设置 卡片 样式
@include setCardStyle;
// 设置 词海
@include cloud-words;
</style>
