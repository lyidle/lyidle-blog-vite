<template>
  <global-tree class="list-container" v-model="listData">
    <template #title="{ pagination }">
      <!-- 头部 文章总览 -->
      <div class="flex justify-between my-1.25rem">
        <div class="text-[1.875rem] font-bold cur-text">
          {{ title }} - {{ pagination?.total || 0 }}
        </div>
        <div class="flex gap-10px items-center" v-if="account">
          <global-name
            v-if="userInfo?.id"
            :account="userInfo?.account"
            :nick="userInfo?.nickName"
          ></global-name>
          <my-button
            class="w-70px"
            size="small"
            v-if="isRestore"
            v-author="{ author: account }"
            @click="$router.push(`/user/docs/restore/${account}`)"
            >回收站</my-button
          >
        </div>
      </div>
    </template>
    <template #list="{ list }: { list: Article }">
      <div class="poster">
        <router-link :to="`/doc/${list.id}`">
          <div
            :style="{
              background: 'no-repeat center',
              backgroundSize: 'cover',
              // 转义url链接
              backgroundImage: list.poster
                ? `url('${escapeUrlForRegExp(list.poster)}')`
                : 'var(--default-img)',
            }"
            class="poster-img"
          />
          <div class="mask"></div>
        </router-link>
      </div>

      <div class="flex flex-col justify-center info w-100%">
        <div class="cur-text">{{ list.createdAt }}</div>
        <div class="title line-clamp-2 w-100% route-link">
          <router-link :to="`/doc/${list.id}`">
            {{ list.title }}
          </router-link>
        </div>
      </div>

      <!-- 每一项的按钮 -->
      <div class="flex" v-if="isTools">
        <!-- 修改 -->
        <my-button
          class="w-80px"
          size="small"
          @click="
            $router.push(`/doc/update?author=${list.author}&id=${list.id}`)
          "
          v-if="isRestore"
          v-author="{ author: list.author }"
          >修改文章</my-button
        >
        <!-- 软删除 -->
        <my-popconfirm
          width="220"
          icon-color="#F56C6C"
          :title="`确认要把《${list.title}》回收到垃圾桶么?`"
          placement="top"
          @confirm="handlerRemove(list.id)"
        >
          <template #reference>
            <my-button
              class="w-80px"
              size="small"
              type="danger"
              v-if="isRestore"
              v-author="{ author: list.author }"
              >软删除文章</my-button
            >
          </template>
          <template #actions="{ confirm, cancel }">
            <my-button
              class="w-unset"
              type="default"
              size="small"
              @click="cancel"
              >否</my-button
            >
            <my-button
              class="w-unset"
              type="danger"
              size="small"
              @click="confirm"
            >
              是
            </my-button>
          </template>
        </my-popconfirm>
        <!-- 删除 -->
        <my-popconfirm
          width="220"
          icon-color="#F56C6C"
          :title="`确认要彻底删除《${list.title}》么?`"
          placement="top"
          @confirm="handlerDelete(list.id)"
        >
          <template #reference>
            <my-button
              class="w-80px"
              size="small"
              type="danger"
              v-author="{ author: list.author }"
              >删除文章</my-button
            >
          </template>
          <template #actions="{ confirm, cancel }">
            <my-button
              class="w-unset"
              type="default"
              size="small"
              @click="cancel"
              >否</my-button
            >
            <my-button
              class="w-unset"
              type="danger"
              size="small"
              @click="confirm"
            >
              是
            </my-button>
          </template>
        </my-popconfirm>
        <slot name="btns" :row="list"></slot>
      </div>
    </template>
  </global-tree>
</template>

<script setup lang="ts" name="ArticleTree">
// 引入 api
import { deleteArticle, removeArticle } from "@/api/article"
import { userFindByPk } from "@/api/user"
// 引入 类型
import type { Article, SearchArticle } from "@/api/article/types/searchArticle"
import type { UserFindByPk } from "@/api/user/types/userFindByPk"
// 处理 时间
import { formatMilliseconds } from "@/utils/times/timeFormatter"
// 处理 url
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"
// 处理 错误
import { handlerReqErr } from "@/utils/request/error/successError"
import { mitt } from "@/utils/emitter"

// 判断是否是回收站页面
const route = useRoute()
const isRestore = !route.path.includes("restore")

// 接收父组件的 属性
withDefaults(
  defineProps<{ account?: string; title?: string; isTools?: boolean }>(),
  {
    isTools: true,
  }
)

// 注入父组件提供的方法
const reqArticles =
  inject<
    (currentPage?: number, pageSize?: number) => Promise<SearchArticle["data"]>
  >("req")

// 用户 id
const _userId = ref<null | number>(null)
// 用户信息
const userInfo = ref<UserFindByPk["data"]>()

const stopUserId = watch(
  () => _userId.value,
  async (newV) => {
    if (!newV) return
    const result = await userFindByPk(newV)
    userInfo.value = result
    stopUserId()
  }
)
let isReq = false

const listData = ref()
// 获取所有文章
const handlerArticles = async (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  if (!reqArticles) return
  const result = await reqArticles(currentPage, pageSize)
  if (!result?.article || !result?.pagination) return
  if (result?.article?.[0]?.userId) _userId.value = result.article[0].userId
  if (isReq)
    // 重新加载路由
    mitt.emit("route:reload")
  isReq = true
  listData.value = {
    list: result.article,
    pagination: result.pagination,
  }
}

defineExpose({ handlerArticles })
// 软删除文章的回调
const handlerRemove = async (id: string | number) => {
  try {
    const expire = await removeArticle(id)
    if (expire) {
      ElMessage.success(
        `移动到回收站成功，有效期${formatMilliseconds(expire)}~`
      )
    }
    // 获取所有文章
    await handlerArticles()
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("软删除文章失败~")
  }
}
// 删除文章的回调
const handlerDelete = async (id: string | number) => {
  try {
    await deleteArticle(id)
    ElMessage.success(`彻底删除文章成功~`)
    // 获取所有文章
    await handlerArticles()
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("彻底删除文章失败~")
  }
}

onMounted(handlerArticles)
// 提供方法
provide("req", handlerArticles)
</script>

<style lang="scss" scoped>
@use "sass:math";
// 设置 卡片 样式
@include setCardStyle;
$gap: 10px;
$poster-size: 100px;
$year-circle-size: 25px;
$year-line-size: 3px;
$circle-size: 15px;
$line-bg: #60a2ce;
$circle-bg: #60a2ce;
$circle-central: var(--primary-card-bg);
$circle-bg-hover: #29597a;
$circle-bg-dur: var(--primary-during);
.list-container {
  // 每一个年份
  .card-container {
    // 年份下的每个文章
    .item {
      // // 海报
      .poster {
        $poster-radius: var(--pages-card-radius);
        width: $poster-size;
        height: $poster-size;
        flex: 0 0 $poster-size;
        overflow: hidden;
        border-radius: $poster-radius;
        position: relative;
        .poster-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--primary-during);
        }
        .mask {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-image: var(--content-mask);
        }
      }
      &:hover .poster .poster-img {
        transform: scale($pages-poster-scale);
      }
      .info {
        gap: $gap;
      }
    }
  }
}
</style>
