<template>
  <global-tree v-model="listData">
    <template #title>
      <h1 class="text-center cur-text">小站建设进程</h1>
    </template>
    <template #list="{ list }">
      <div class="flex-1">
        <div class="cur-text w-fit text-16px">
          {{ moment(list.createdAt) }}
        </div>
        <my-card class="card_style my-10px">
          <ul class="siteTimesList p-20px rounded-10px text-16px">
            <li v-for="text in handlerList(list.content)">
              {{ text }}
            </li>
          </ul>
        </my-card>
      </div>
    </template>
  </global-tree>
</template>

<script setup lang="ts" name="Time">
// 引入 api
import { getSiteTimes } from "@/api/webInfo"
import moment from "@/utils/moment"

const listData = ref()

// 获取所有文章
const handlerArticles = async (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  try {
    const result = await getSiteTimes({
      currentPage,
      pageSize,
    })
    const handler = {
      list: result.list,
      pagination: result.pagination,
    }
    listData.value = handler
    return handler
  } catch (error) {}
}

const handlerList = (text: string) => {
  if (!text) return []
  return text.split(/\n/).filter((item) => item.trim() !== "")
}

onMounted(handlerArticles)
// 提供方法
provide("req", handlerArticles)
</script>
<style scoped lang="scss">
// 设置 卡片 样式
@include setCardStyle(primary, false);
.card_style {
  --primary-card-shadow: 0 1px 10px var(--primary-shadow-color);
}
.siteTimesList {
  counter-reset: item-counter; // 初始化计数器

  > li {
    margin-top: 5px;
    cursor: var(--cursor-text);
    user-select: text;

    &::before {
      counter-increment: item-counter; // 递增计数器
      content: counter(item-counter) ". "; // 显示计数器值
      cursor: var(--cursor-default);
    }
  }
}
</style>
