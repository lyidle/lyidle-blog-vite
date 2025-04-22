<template>
  <div
    class="footer-container w-100% mt-20px relative flex flex-col items-center color-[var(--primary-color)] gap-10px card_style"
  >
    <div class="cur-text text-16px">
      {{ copyright }}&nbsp;By&nbsp;{{ VITE_INITIAL_LOGO }}
    </div>
    <div class="cur-text">
      本站运行时间&nbsp;:&nbsp;{{ showWebTime ? showWebTime : "未知时间" }}
    </div>
    <div class="cur-text text-justify">
      免责声明：本博客为个人原创博客，所有内容仅代表作者个人观点，与任何组织、机构或公司无关。访问者在使用本博客提供的信息时，需自行承担风险;
      本站为非盈利性站点,所有内容均不作为商业行为。
    </div>
  </div>
</template>

<script setup lang="ts" name="LayoutFooter">
// 引入api
import { findOneSetting } from "@/api/admin"
import { getWebInfo } from "@/api/webInfo"
// 引入 moment
import { mitt } from "@/utils/emitter"
import moment from "moment"

const VITE_INITIAL_LOGO = import.meta.env.VITE_INITIAL_LOGO

// 显示的数据
const webCreatedAt = ref<Date>()
const showWebTime = ref<string>()

// 发起请求
const reqWebInfo = async () => {
  const { webCreatedAt: createdAt } = await getWebInfo()
  // 整理参数
  if (createdAt) webCreatedAt.value = new Date(createdAt)
  else webCreatedAt.value = undefined
}

const copyright = ref<string>()

const reqCopyright = async () => {
  const result = await findOneSetting("版权")
  copyright.value = (result.content as string) || ""
}
onMounted(reqCopyright)

mitt.on("reloadWebInfo", reqWebInfo)

const updateRelativeTime = () => {
  if (!webCreatedAt.value) return

  const now = moment()
  const createdAt = moment(webCreatedAt.value)
  const duration = moment.duration(now.diff(createdAt))

  // 提取时间单位（自动处理进位）
  const days = Math.floor(duration.asDays()) // 总天数
  const hours = duration.hours() // 剩余小时
  const minutes = duration.minutes() // 剩余分钟
  const seconds = duration.seconds() // 剩余秒

  // 层级判断逻辑（与原生JS版本一致）
  const hasDays = days > 0
  const hasHours = hasDays || hours > 0
  const hasMinutes = hasHours || minutes > 0

  // 按需拼接字符串
  const dayStr = hasDays ? `${days}天` : ""
  const hourStr = hasHours ? `${hours}小时` : ""
  const minuteStr = hasMinutes ? `${minutes}分` : ""
  const secondStr = `${seconds}秒`

  showWebTime.value = `${dayStr}${hourStr}${minuteStr}${secondStr}`

  requestAnimationFrame(updateRelativeTime)
}
// 组件初始化 加载数据
onMounted(async () => {
  await reqWebInfo()
  if (!webCreatedAt.value) return

  requestAnimationFrame(updateRelativeTime)
})

onBeforeUnmount(() => {
  mitt.off("reloadWebInfo", reqWebInfo)
})
</script>

<style scoped lang="scss">
@include setCardStyle;
.footer-container {
  --primary-card-shadow: -5px -5px 10px var(--primary-shadow-color);
  --primary-card-shadow-fixed: 0px -5px 10px var(--primary-shadow-color-fixed);
  z-index: $global-content-index;
  padding: 20px 60px;
  padding-bottom: 25px;
}
</style>
