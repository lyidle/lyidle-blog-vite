<template>
  <layout-content>
    <template #content-start>
      <layout-carousel
        :data="carousel"
        autoplay
        direction="top"
        :dur="1000"
        :gap="1500"
        v-if="carousel"
      >
      </layout-carousel>
    </template>
    <template #content-card>
      <layout-content-card
        v-for="item in article"
        class="content-card"
        :article="item"
        v-if="article"
      >
      </layout-content-card>
    </template>
    <template #content-end>
      <div class="flex justify-center m-t-[var(--content-gap)]">
        <el-pagination
          v-if="pagination?.total"
          background
          layout="prev, pager, next, sizes"
          :total="pagination.total"
          :page-sizes="[10, 20, 30]"
          @change="reqArticles"
        />
      </div>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="Home">
// 引入api
import { getCarousel, getArticle } from "@/api/article"
// 引入类型
import type { Article, Pagination } from "@/api/article/types/getArticle"
import type { GetCarousel } from "@/api/article/types/getCarousel"

// 存储焦点轮播图数据
const carousel = ref<GetCarousel["data"]>()
// 存储文章数据
const article = ref<Article[]>()

// 获取轮播
const reqCarousel = async () => {
  const Carousel = await getCarousel()
  carousel.value = Carousel
}
const pagination = ref<Pagination>()
// 获取文章
const reqArticles = async (currentPage: number = 1, pageSize: number = 10) => {
  const Article = await getArticle(currentPage, pageSize)
  article.value = Article?.article
  pagination.value = Article?.pagination
}
// 初始化数据
onMounted(async () => {
  await reqCarousel()
  await reqArticles()
})
</script>
<style scoped lang="scss"></style>
