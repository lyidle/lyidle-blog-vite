<template>
  <layout-content>
    <template #content-start>
      <my-card class="card_style allDocs">
        <!-- 头部 文章总览 -->
        <div class="flex justify-between my-1.25rem">
          <div class="text-[1.875rem] font-bold cur-text">
            {{ title }} - {{ pagination?.total || 0 }}
          </div>
          <div class="flex gap-10px items-center">
            <my-tooltip
              class="box-item"
              effect="dark"
              content="作者"
              placement="top"
            >
              <div class="cur-text">
                {{ account }}
              </div>
            </my-tooltip>
            <my-button
              class="w-70px"
              size="small"
              @click=""
              v-tip="{ type: 'warning', msg: '开发中~~' }"
              v-author="{ author: account }"
              >回收站</my-button
            >
          </div>
        </div>
        <!-- 时间树形结构 -->
        <div v-for="item in articles" :key="item.year" class="card-container">
          <div class="years cur-text text-[1.625rem] my-0.9375rem">
            {{ item.year }}
          </div>
          <div class="item" v-for="article in item.articles" :key="article.id">
            <div class="poster">
              <router-link :to="`/doc/${article.id}`">
                <div
                  :style="{
                    background: 'no-repeat center',
                    backgroundSize: 'cover',
                    // 转义url链接
                    backgroundImage: article.poster
                      ? `url('${escapeUrlForRegExp(article.poster)}')`
                      : 'var(--default-img)',
                  }"
                  class="poster-img"
                />
                <div class="mask"></div>
              </router-link>
            </div>
            <div class="flex flex-col justify-center info w-100%">
              <div class="cur-text">{{ article.createdAt }}</div>
              <div class="title line-clamp-2 w-100% route-link">
                <router-link :to="`/doc/${article.id}`">
                  {{ article.title }}
                </router-link>
              </div>
            </div>
            <!-- 每一项的按钮 -->
            <div class="flex">
              <!-- 修改 -->
              <my-button
                class="w-50px"
                size="small"
                @click="
                  $router.push(
                    `/doc/update?author=${article.author}&id=${article.id}`
                  )
                "
                v-author="{ author: article.author }"
                >修改</my-button
              >
              <!-- 软删除 -->
              <my-popconfirm
                width="220"
                icon-color="#F56C6C"
                :title="`确认要把《${article.title}》回收到垃圾桶么?`"
                placement="top"
                @confirm="handlerRemove(article.id)"
              >
                <template #reference>
                  <my-button
                    class="w-50px"
                    size="small"
                    type="danger"
                    v-author="{ author: article.author }"
                    >软删除</my-button
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
                :title="`确认要彻底删除《${article.title}》么?`"
                placement="top"
                @confirm="handlerDelete(article.id)"
              >
                <template #reference>
                  <my-button
                    class="w-50px"
                    size="small"
                    type="danger"
                    v-author="{ author: article.author }"
                    >删除</my-button
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
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-40px">
          <my-pagination
            v-if="pagination?.total"
            background
            layout="prev, pager, next, sizes"
            :total="pagination.total"
            :page-sizes="[10, 20, 30]"
            @change="handlerArticles"
          />
        </div>
      </my-card>
    </template>
    <template #content-end> </template>
  </layout-content>
</template>

<script setup lang="ts" name="ArticleTree">
// 引入 api
import { deleteArticle, removeArticle } from "@/api/article"
// 引入 类型
import type { Article, SearchArticle } from "@/api/article/types/searchArticle"
import type { Pagination } from "@/api/admin/types/findAllRolesPagination"
// 引入 utils
import { orderArticle } from "@/utils/doc/orderArticle"
// 引入 moment
import moment from "@/utils/moment"
// 处理 时间
import { formatMilliseconds } from "@/utils/times/timeFormatter"
// 处理 url
import { escapeUrlForRegExp } from "@/RegExp/Url/replace/escapeUrlForRegExp"

// 所有文章
// 定义按年份分组的类型
interface YearGroupedArticles {
  year: string
  articles: Article[]
}
const articles = ref<YearGroupedArticles[]>([])

const pagination = ref<Pagination>()

// 接收父组件的 属性
defineProps(["account", "title"])

// 注入父组件提供的方法
const reqArticles =
  inject<
    (currentPage?: number, pageSize?: number) => Promise<SearchArticle["data"]>
  >("req")

// 获取所有文章
const handlerArticles = async (
  currentPage: number = 1,
  pageSize: number = 10
) => {
  if (!reqArticles) return
  const result = await reqArticles(currentPage, pageSize)
  if (result?.article?.length) {
    // 处理排序
    const sortedArticles = orderArticle(result.article, true) as Article[]
    // 处理时间
    const mappedArticles = sortedArticles.map((item) => ({
      ...item,
      createdAt: moment(item.createdAt),
    }))
    // 年份归类
    const groupedArticles = mappedArticles.reduce((acc, article) => {
      const year = article.createdAt.split("-")[0] // 提取年份
      let found = acc.find((group) => group.year === year)
      if (found) {
        found.articles.push(article)
      } else {
        acc.push({ year, articles: [article] })
      }
      return acc
    }, [] as { year: string; articles: Article[] }[])
    // 更新数据
    articles.value = groupedArticles
    pagination.value = result.pagination
  }
}

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
    ElMessage.error("软删除文章失败~")
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
    ElMessage.error("彻底删除文章失败~")
  }
}
onMounted(async () => {
  // 获取所有文章
  await handlerArticles()
})
</script>

<style scoped lang="scss">
// 设置 卡片 样式
@include setCardStyle;
$gap: 10px;
$poster-size: 6.25rem;
$year-circle-size: 25px;
$year-line-size: 3px;
$circle-size: 15px;
$line-bg: #60a2ce;
$circle-bg: #60a2ce;
$circle-central: var(--pages-card-bg);
$circle-bg-hover: #29597a;
$circle-bg-dur: var(--primary-during);
.allDocs {
  padding: 40px;
  // 每一个年份
  .card-container {
    position: relative;
    margin-left: 35px;
    // 线
    &::after {
      display: block;
      content: "";
      width: $year-line-size;
      height: 100%;
      background-color: $line-bg;
      position: absolute;
      top: 0;
      // 和 圆 居中
      left: -$year-line-size - $gap -
        ($year-circle-size / 2 - $year-line-size / 2);
    }
    .years {
      // 年份的大圆
      &::before {
        cursor: var(--cursor-default);
        display: block;
        content: "";
        width: $year-circle-size;
        height: $year-circle-size;
        background-color: $circle-bg;
        position: absolute;
        top: 0;
        left: -$year-circle-size - $gap;
        border-radius: 50%;
        z-index: 2;
        transition: background $circle-bg-dur;
      }
      &:hover {
        &::before {
          background-color: $circle-bg-hover;
        }
      }
      // 中心原
      &::after {
        cursor: var(--cursor-default);
        $size: $year-circle-size - 10px;
        display: block;
        content: "";
        width: $size;
        height: $size;
        background-color: $circle-central;
        position: absolute;
        top: $year-circle-size / 2 - 8px;
        // 和 圆 居中
        left: -$size - $gap - ($year-circle-size / 2 - $size / 2);
        border-radius: 50%;
        z-index: 2;
      }
    }
    // 年份下的每个文章
    .item {
      display: flex;
      gap: $gap;
      margin-top: $gap;
      position: relative;
      justify-content: space-between;
      align-items: center;
      // 每个文章的小圆
      &::before {
        display: block;
        content: "";
        width: $circle-size;
        height: $circle-size;
        background-color: $circle-bg;
        position: absolute;
        // 和 圆 居中
        left: -$circle-size - $gap - ($year-circle-size / 2 - $circle-size / 2);
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        z-index: 2;
        transition: background $circle-bg-dur;
      }
      &:hover {
        &::before {
          background-color: $circle-bg-hover;
        }
      }
      // 中心原
      &::after {
        $size: $circle-size - 8px;
        display: block;
        content: "";
        width: $size;
        height: $size;
        background-color: $circle-central;
        position: absolute;
        // 和 圆 居中
        left: -$size - $gap - ($year-circle-size / 2 - $size / 2);
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
        z-index: 2;
      }
      // 海报
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
