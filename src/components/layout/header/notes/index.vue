<template>
  <template v-if="data.length">
    <my-menu-instance
      :data="item"
      v-for="item in data"
      :showTitleIcon="isNavIcon"
    ></my-menu-instance>
  </template>
</template>

<script setup lang="ts" name="HeaderNotes">
// 引入 接口
import { findOneSetting } from "@/api/admin"
import { getCategoryToTags } from "@/api/article"
// 引入 类型
import type { MenuData } from "@/components/my/menu/instance/types"
import type { FindOneSetting } from "@/api/admin/types/findOneSetting"

// 引入 仓库
import { useSettingStore } from "@/store/setting"
// 提取数据
const { isNavIcon } = storeToRefs(useSettingStore())

const data = ref<MenuData>([])

// 得到 分类对应的 标签
const reqTags = async (categories: string[]) => {
  // 存储 category 对应的 tags
  const categoryToTags: { [key in string]: string[] } = {}
  // 发请求 得到 对应标签下的所有 标签 处理成需要的格式返回
  for (const value of categories) {
    try {
      const result = await getCategoryToTags(value)
      const pre = categoryToTags[value]
      categoryToTags[value] = Array.from(
        new Set([pre, result].flat(Infinity))
      ).filter(Boolean) as string[]
    } catch (error) {
      console.log(`获取${value}分类对应的所有标签失败`)
    }
  }
  return categoryToTags
}

// 得到 笔记菜单项 并处理成对应的格式 进行赋值
const handlerData = async () => {
  let Notes: FindOneSetting["data"] | null = null
  try {
    Notes = await findOneSetting("笔记菜单项")
  } catch (error) {
    console.error(error, "查询笔记失败")
    return
  }
  if (!Array.isArray(Notes?.content) || !Notes?.content?.length) return
  // 得到 分类对应的 标签
  const children = await reqTags(Notes.content)
  if (!children) return
  const keys = Object.keys(children)
  if (!keys.length) return

  // 把 分类对应的 标签 处理成 对应的 children 格式
  const result = keys.map((item) => ({
    name: item,
    children: children[item].map((item) => ({
      name: item,
      to: `/tags/search?tags=${item}`,
    })),
  }))

  // 赋值
  data.value = [
    {
      name: "笔记",
      children: result,
    },
  ]
}
// 挂载
onMounted(async () => {
  await handlerData()
})
</script>
