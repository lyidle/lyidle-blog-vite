<template>
  <layout-banner> </layout-banner>
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
        :category="{
          to: `/categories/${item.category}`,
          content: item.category,
        }"
        :label="item.tags"
        :key="item.id"
        v-if="article"
      >
        <template #poster>
          <router-link :to="`/categories/${item.category}/${item.id}`">
            <img
              class="poster scale-[1.01]"
              :style="{
                background: 'no-repeat center',
                backgroundSize: 'cover',
                backgroundImage: item.poster
                  ? item.poster
                  : 'var(--default-img)',
              }"
              alt=""
            />
          </router-link>
        </template>
        <template #description>{{ item.desc }}</template>
        <template #title>
          <router-link
            :to="`/categories/${item.category}/${item.id}`"
            class="line-clamp-2 p-x-20px text-center"
          >
            <span>
              {{ item.title }}
            </span>
          </router-link>
        </template>
        <template #publish>{{ moment(item.createdAt) }}</template>
        <template #update>{{ moment(item.updatedAt) }}</template>
      </layout-content-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="Home">
// 引入api
import { getCarousel, getArticle } from "@/api/article"
// 引入类型
import { Article } from "@/api/article/types/getArticle"
import { GetCarousel } from "@/api/article/types/getCarousel"
// 引入moment格式化时间
import moment from "@/utils/moment"

// 存储焦点轮播图数据
const carousel = ref<GetCarousel["data"]>()
// 存储文章数据
const article = ref<Article[]>()

// 获取轮播
const reqCarousel = async () => {
  const Carousel = await getCarousel()
  carousel.value = Carousel
}
// 获取文章
const reqArticles = async () => {
  const Article = await getArticle()
  article.value = Article?.article
}

// 初始化数据
onMounted(async () => {
  await reqCarousel()
  await reqArticles()
})
</script>
<style scoped lang="scss"></style>
