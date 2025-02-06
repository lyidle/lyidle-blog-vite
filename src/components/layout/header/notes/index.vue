<template>
  <li class="custom-menu-trigger">
    <a>
      <i class="i-lucide:notebook-pen w-1em h-1em"> </i>
      笔记
    </a>
    <my-menu :triangle="true" left="-25px" :menuStyle class="my-menu-container">
      <!-- 前端 -->
      <layout-header-notes-menu
        :menuStyle
        :data="Frontend"
        name="前端"
        v-if="Frontend.length"
      ></layout-header-notes-menu>
      <!-- 后端 -->
      <layout-header-notes-menu
        :menuStyle
        :data="Backend"
        name="后端"
        v-if="Backend.length"
      ></layout-header-notes-menu>
      <!-- 后端 -->
      <layout-header-notes-menu
        :menuStyle
        :data="SoftWare"
        name="软件"
        v-if="SoftWare.length"
      ></layout-header-notes-menu>
    </my-menu>
  </li>
</template>

<script setup lang="ts" name="HeaderNotes">
// 引入 接口
import { searchArticleExact } from "@/api/article"
// 引入类型
import { menuStyleType } from "@/components/my-menu/types"

// 接收props
defineProps<{ menuStyle?: menuStyleType }>()

// 前端 分类的 tags
const Frontend = ref<string[]>([])
// 后端 分类的 tags
const Backend = ref<string[]>([])
// 软件
const SoftWare = ref<string[]>([])

// 获取菜单项 tags
const reqTags = async (category: string, setRef: Ref<string[]>) => {
  // 得到 tags 是全站文章的 category 个数默认是 10个
  const result = await searchArticleExact({ category })
  // 去重 存储
  setRef.value = [
    ...new Set([result.article.map((item) => item.tags)].flat(Infinity)),
  ] as string[]
}

// 挂载
onMounted(async () => {
  // 获取 前端 分类的 tags
  await reqTags("前端", Frontend)
  // 获取 后端 分类的 tags
  await reqTags("后端", Backend)
})
</script>
