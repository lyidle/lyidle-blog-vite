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
        v-for="item in carouselItem"
        class="content-card"
        :category="{ to: item.category.to, content: item.category.content }"
        :label="{ to: item.tags.to, content: item.tags.content }"
        :key="item.id"
      >
        <template #poster>
          <router-link :to="item.to">
            <img :src="item.poster" alt="" class="poster" v-if="item.poster" />
            <img
              src="/src/assets/images/base-bg-light.png"
              alt=""
              class="poster"
              v-else
            />
          </router-link>
        </template>
        <template #description>{{ item.description }}</template>
        <template #title>
          <router-link :to="item.to">{{ item.title }}</router-link>
        </template>
        <template #publish>{{ item.publish }}</template>
        <template #update>{{ item.update }}</template>
      </layout-content-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="Home">
// 引入api
import { reqCarousel, reqArticle } from "@/api/article"
import { carouselType } from "@/api/article/type"
let result = new URL("@/assets/images/base-bg-light.png", import.meta.url).href
const carouselItem: carouselType = [
  {
    id: 1,
    publish: "2022-12-31",
    to: "/doc/category-uuid",
    category: {
      to: "/category/categoryName",
      content: "分类",
    },
    tags: {
      to: "/tags/tagName",
      content: ["标签1", "标签2"],
    },
    update: "2023-11-31",
    title: "Markdown语法与外挂标签写法汇总",
    poster: result,
    description:
      "本文汇总Markdown格式以及外挂标签在网页端的渲染效果，可作为文档进行查询",
  },
  {
    id: 2,
    publish: "2022-12-31",
    to: "/doc/category-uuid",
    category: {
      to: "/category/categoryName",
      content: "分类",
    },
    tags: {
      to: "/tags/tagName",
      content: ["标签1"],
    },
    update: "2023-11-31",
    title: "Markdown语法与外挂标签写法汇总",
    poster: result,
    description:
      "本文汇总Markdown格式以及外挂标签在网页端的渲染效果，可作为文档进行查询",
  },
  {
    id: 3,
    publish: "2022-12-31",
    to: "/doc/category-uuid",
    category: {
      to: "/category/categoryName",
      content: "分类",
    },
    tags: {
      to: "/tags/tagName",
      content: ["标签1"],
    },
    update: "2023-11-31",
    title: "Markdown语法与外挂标签写法汇总",
    poster: result,
    description:
      "本文汇总Markdown格式以及外挂标签在网页端的渲染效果，可作为文档进行查询",
  },
  {
    id: 4,
    publish: "2022-12-31",
    to: "/doc/category-uuid",
    category: {
      to: "/category/categoryName",
      content: "分类",
    },
    tags: {
      to: "/tags/tagName",
      content: ["标签1"],
    },
    update: "2023-11-31",
    title: "Markdown语法与外挂标签写法汇总",
    poster: result,
    description:
      "本文汇总Markdown格式以及外挂标签在网页端的渲染效果，可作为文档进行查询",
  },
  {
    id: 5,
    publish: "2022-12-31",
    to: "/doc/category-uuid",
    category: {
      to: "/category/categoryName",
      content: "分类",
    },
    tags: {
      to: "/tags/tagName",
      content: ["标签1"],
    },
    update: "2023-11-31",
    title: "Markdown语法与外挂标签写法汇总",
    poster: result,
    description:
      "本文汇总Markdown格式以及外挂标签在网页端的渲染效果，可作为文档进行查询",
  },
]
// 存储焦点轮播图数据
const carousel = ref()
// 存储文章数据
const article = ref()
onBeforeMount(async () => {
  // 整理焦点轮播图
  carousel.value = await reqCarousel()
  const result = await reqArticle()
  article.value = result.article
})
</script>
<style scoped lang="scss"></style>
