<template>
  <span v-if="!errTimes"> {{ times }} </span>
  <span v-else>
    {{ errTimes }}
  </span>
</template>

<script setup lang="ts" name="ArticleTimes">
// 引入 api
import { getArticleTime, putArticleTimeRaw } from "@/api/article"
// 引入 类型
import type { GetOneArticle } from "@/api/article/types/getOneArticle"
import {
  formatMilliseconds,
  parseTimeToMilliseconds,
} from "@/utils/times/timeFormatter"
import Big from "big.js"

const props = defineProps<{ article: GetOneArticle["data"] }>()
const times = ref("0秒")
const errTimes = ref()

// 得到 阅读时间
const articleTimes = async () => {
  const id = props.article?.id
  if (!id) return
  try {
    const result = await getArticleTime(id)
    // 不存在 则赋值
    if (!result) return
    // 赋值
    times.value = result
  } catch (error) {
    errTimes.value = "获取失败"
    console.warn("获取阅读时间失败")
  }
}

// 进入 的 时间
let getTime = Date.now()

// 更新时间的 回调
const updateTimes = () => {
  const id = props.article?.id
  if (!id) return
  try {
    // 计算本次阅读时间（当前时间减去进入时间）
    const currentReadingTime = Date.now() - getTime

    // 如果阅读时间小于1秒，则不记录
    if (currentReadingTime <= 1000) return

    // 解析原有的时间字符串为毫秒数（Big.js字符串格式）
    const oldTimeMs = parseTimeToMilliseconds(times.value)

    // 将本次阅读时间转换为Big.js对象
    const currentReadingTimeBig = new Big(currentReadingTime)

    // 计算新的总时间（旧时间 + 本次阅读时间）
    const newTimeMs = new Big(oldTimeMs).plus(currentReadingTimeBig)

    // 格式化为易读的时间字符串
    const formattedTime = formatMilliseconds(newTimeMs.toString())

    // 如果时间没有更新则取消更新
    if (times.value === formattedTime) return

    // 如果格式化后的时间包含"秒"（即小于1分钟），则不更新
    if (formattedTime.includes("秒")) return

    // 更新时间到服务器
    putArticleTimeRaw({
      articleId: id,
      time: formattedTime,
    })

    // 更新本地显示的时间
    times.value = formattedTime

    // 重置进入时间
    getTime = Date.now()
  } catch (error) {
    console.error("更新阅读时间失败~", error)
  }
}

// 获取时间
onMounted(articleTimes)
// 更新时间
onUnmounted(updateTimes)
window.addEventListener("unload", updateTimes)
</script>

<style scoped></style>
