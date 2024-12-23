<template>
  <layout-banner> </layout-banner>
  <layout-content>
    <template #content-start>
      <layout-carousel
        :data="carousel"
        autoplay
        direction="top"
        v-if="carousel"
      >
      </layout-carousel>
    </template>
    <template #content-card>
      <layout-content-card
        v-for="item in article"
        class="content-card"
        :category="{
          to: `/categories/${item.category}/${item.id}`,
          content: item.category,
        }"
        :label="item.tags"
        :key="item.id"
      >
        <template #poster>
          <router-link :to="`/categories/${item.category}`">
            <img :src="item.poster" alt="" class="poster" v-if="item.poster" />
            <img
              class="poster bg=var(--default-img) scale-[1.009]"
              alt=""
              v-else
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
import moment from "@/utils/moment"
// 存储焦点轮播图数据
const carousel = ref<GetCarousel["data"]>()
// 存储文章数据
const article = ref<Article[]>()
onBeforeMount(async () => {
  // 整理焦点轮播图
  const Carousel = await getCarousel()
  carousel.value = Carousel
  const Article = await getArticle()
  article.value = Article.article
})
</script>
<style scoped lang="scss"></style>
