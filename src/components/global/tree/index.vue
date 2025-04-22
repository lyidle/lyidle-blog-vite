<template>
  <layout-content>
    <template #content-start>
      <my-card class="card_style all-list" v-bind="$attrs">
        <slot name="title" :pagination="data?.pagination"></slot>
        <template v-if="data?.pagination?.total">
          <!-- 时间树形结构 -->
          <div v-for="item in list" :key="item.year" class="card-container">
            <div class="years cur-text text-[1.625rem] my-0.9375rem">
              {{ item.year }}
            </div>
            <div class="item" v-for="list in item.list" :key="list.id">
              <slot name="list" :list="list"></slot>
            </div>
          </div>
          <div class="flex justify-center mt-40px">
            <my-pagination
              background
              layout="prev, pager, next, sizes"
              :total="data.pagination.total"
              :page-sizes="[10, 20, 30]"
              @change="reqArticles"
            />
          </div>
        </template>
        <my-empty v-else></my-empty>
      </my-card>
    </template>
    <template #content-end> </template>
  </layout-content>
</template>

<script setup lang="ts" name="ArticleTree">
// 引入 utils
import { paginationQuery } from "@/api/types/paginationQuery"
import { orderArticle } from "@/utils/doc/orderArticle"
// 引入 moment
import moment from "@/utils/moment"

// 所有文章
// 定义按年份分组的类型
interface YearGroupedArticles {
  year: string
  list: any[]
}

const data = defineModel<{ list: any[]; pagination: paginationQuery }>()

const list = computed(() => {
  if (!data.value?.list || !data.value.pagination) return
  // 处理排序
  const sortedArticles = orderArticle(data.value.list, true)
  // 处理时间
  const mappedArticles = sortedArticles.map((item) => ({
    ...item,
    createdAt: moment(item.createdAt),
  }))

  // 年份归类
  const groupedArticles = mappedArticles.reduce((acc, article) => {
    const year = article.createdAt.split("-")[0] // 提取年份
    let found = acc.find((group) => group.year === year)
    if (found) {
      found.list.push(article)
    } else {
      acc.push({ year, list: [article] })
    }
    return acc
  }, [] as YearGroupedArticles[])

  return groupedArticles
})

// 注入父组件提供的方法
const reqArticles =
  inject<(currentPage?: number, pageSize?: number) => Promise<any>>("req")
</script>

<style scoped lang="scss">
@use "sass:math";
// 设置 卡片 样式
@include setCardStyle;
$gap: 10px;
$poster-size: 6.25rem;
$year-circle-size: 25px;
$year-line-size: 3px;
$circle-size: 15px;
$line-bg: #60a2ce;
$circle-bg: #60a2ce;
$circle-central: var(--primary-card-bg);
$circle-bg-hover: #29597a;
$circle-bg-dur: var(--primary-during);
.all-list {
  padding: 40px;
  // 每一个年份
  .card-container {
    position: relative;
    margin-left: 35px;
    // 线
    &::after {
      display: block;
      content: "";
      width: $year-line-size;
      height: 100%;
      background-color: $line-bg;
      position: absolute;
      top: 0;
      // 和 圆 居中
      left: -$year-line-size - $gap -
        (math.div($year-circle-size, 2)- math.div($year-line-size, 2));
    }
    .years {
      // 年份的大圆
      &::before {
        cursor: var(--cursor-default);
        display: block;
        content: "";
        width: $year-circle-size;
        height: $year-circle-size;
        background-color: $circle-bg;
        position: absolute;
        top: 0;
        left: -$year-circle-size - $gap;
        border-radius: 50%;
        z-index: 2;
        transition: background $circle-bg-dur;
      }
      &:hover {
        &::before {
          background-color: $circle-bg-hover;
        }
      }
      // 中心原
      &::after {
        cursor: var(--cursor-default);
        $size: $year-circle-size - 10px;
        display: block;
        content: "";
        width: $size;
        height: $size;
        background-color: $circle-central;
        position: absolute;
        top: math.div($year-circle-size, 2) - 8px;
        // 和 圆 居中
        left: -$size - $gap -
          (math.div($year-circle-size, 2) - math.div($size, 2));
        border-radius: 50%;
        z-index: 2;
      }
    }
    .item {
      display: flex;
      gap: $gap;
      margin-top: $gap;
      position: relative;
      justify-content: space-between;
      align-items: center;
      // 每个文章的小圆
      &::before {
        display: block;
        content: "";
        width: $circle-size;
        height: $circle-size;
        background-color: $circle-bg;
        position: absolute;
        // 和 圆 居中
        left: -$circle-size - $gap -
          (math.div($year-circle-size, 2) - math.div($circle-size, 2));
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        z-index: 2;
        transition: background $circle-bg-dur;
      }
      &:hover {
        &::before {
          background-color: $circle-bg-hover;
        }
      }
      // 中心原
      &::after {
        $size: $circle-size - 8px;
        display: block;
        content: "";
        width: $size;
        height: $size;
        background-color: $circle-central;
        position: absolute;
        // 和 圆 居中
        left: -$size - $gap -
          (math.div($year-circle-size, 2) - math.div($size, 2));
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        z-index: 2;
      }
    }
  }
}
</style>
