<template>
  <template v-if="data.length">
    <my-menu-instance
      :data="item"
      :name="item.name"
      v-for="item in data"
    ></my-menu-instance>
  </template>
</template>

<script setup lang="ts" name="HeaderNotes">
// 引入 接口
import { searchArticleExact } from "@/api/article"
import { MenuData } from "@/components/my/menu/instance/types"

const data = ref<MenuData>([])

// 获取菜单项 tags
const reqTags = async (category: string, name: string = category) => {
  // 得到 tags 是全站文章的 category 个数默认是 10个
  const result = await searchArticleExact({ category })
  // 处理成需要的格式
  const handler =
    // 去重
    [...new Set([result.article.map((item) => item.tags)].flat(Infinity))]
      // 处理成需要的格式
      .map((item) => ({
        name: item,
      })) as MenuData

  // 添加数据
  data.value.push({
    name,
    children: handler,
  })
}

// 挂载
onMounted(async () => {
  // 获取 前端 分类的 tags
  await reqTags("前端")
  // 获取 后端 分类的 tags
  await reqTags("后端")
  // 去重
  data.value = [
    { name: "笔记", children: Array.from(new Set(toRaw(data.value))) },
  ]
})
</script>
