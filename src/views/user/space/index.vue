<template>
  <layout-content ref="layoutRef">
    <template #content-start>
      <my-card class="card_style allDocs">
        <div class="header">
          <div class="avatar-container">
            <div
              :style="{
                background: 'no-repeat center',
                backgroundSize: 'cover',
                backgroundImage: userInfo?.avatar
                  ? `url('${userInfo?.avatar}')`
                  : 'var(--default-avatar)',
              }"
              class="avatar w-100% h-100% block"
            />
            <div
              class="mask cur-pointer"
              @click="userEditorScene"
              v-if="userToken"
            >
              更换头像
            </div>
          </div>
          <div class="pl-30px flex flex-col justify-center gap-5px">
            <div class="nickName text-24px">{{ userInfo?.nickName }}</div>
            <div class="signer text-18px">{{ userInfo?.signer }}</div>
          </div>
          <div class="tools">
            <!-- 关注 -->
            <my-button
              class="p-0px w-125px h-35px pr-5px"
              v-if="userAccount !== userInfo?.account"
            >
              <i class="i-mynaui:plus size-18px"></i>
              <span>关注</span>
            </my-button>

            <my-button
              class="p-0px w-125px h-35px pr-5px"
              v-if="userAccount !== userInfo?.account"
            >
              <i class="i-mynaui:plus size-18px"></i>
              <span>发消息</span>
            </my-button>
          </div>
        </div>
        <global-animations-ribbon
          bg="var(--primary-color)"
          class="my-15px"
        ></global-animations-ribbon>
        <div class="flex items-center mb-20px">
          <span class="text-26px font-bold">文章</span>
          <span>·{{ pagination?.total }}</span>
        </div>
        <div
          class="contain"
          :style="{ '--pages-card-contentNum': layoutRef?.contentNum }"
        >
          <layout-content-card
            v-for="item in articles"
            class="content-card"
            :article="item"
            v-if="articles"
          >
          </layout-content-card>
        </div>

        <div class="flex justify-center mt-30px">
          <my-pagination
            v-if="pagination?.total"
            background
            layout="prev, pager, next, sizes"
            :total="pagination.total"
            :page-sizes="[10, 20, 30]"
            @change="reqArticles"
          />
        </div>
      </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="UserSpace">
// 引入 api
import { searchArticleExact } from "@/api/article"
import { searchCounts } from "@/api/user"
// 引入 类型
import type { Datum as userInfoType } from "@/api/user/types/searchCountsById"
import type {
  Pagination,
  SearchArticle,
} from "@/api/article/types/searchArticle"
// 引入 hooks
import { useUserEditorScene } from "@/hooks/useUserEditorScene"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取需要的数据
const { userToken, userAccount } = storeToRefs(useUserStore())
const layoutRef = ref()

// 切换 到编辑用户界面
const userEditorScene = useUserEditorScene()
// 得到 账号名
const route = useRoute()
const account = route.params.author as string
// 存储 用户信息
const userInfo = ref<userInfoType>()

// 得到 用户的信息
const reqUserInfo = async () => {
  if (account) {
    const result = await searchCounts({ isBin: "true", account })
    userInfo.value = result?.[0]
  }
}

// 存储文章信息
const articles = ref<SearchArticle["data"]["article"]>()
const pagination = ref<Pagination>()
// 得到 文章信息
const reqArticles = async (currentPage: number = 1, pageSize: number = 10) => {
  const result = await searchArticleExact({
    author: account,
    currentPage,
    pageSize,
  })
  articles.value = result.article
  pagination.value = result.pagination
}
onMounted(async () => {
  await reqUserInfo()
  await reqArticles()
})
</script>

<style scoped lang="scss">
// 左右间距
$item-gap: var(--content-gap);
$translate-y: -5px;
// 设置 卡片 样式
@include setCardStyle;
.allDocs {
  padding: 20px;
  // 头部
  .header {
    display: flex;
    // 头像
    .avatar-container {
      border-radius: 50%;
      overflow: hidden;
      width: fit-content;
      position: relative;
      .avatar {
        --avatar-size: 80px;
        width: var(--avatar-size);
        height: var(--avatar-size);
        border-radius: 50%;
        position: relative;
        overflow: hidden;
      }
      &:hover {
        .mask {
          opacity: 1;
        }
      }
      .mask {
        position: absolute;
        border-radius: 50%;
        inset: 0;
        background-color: #98989886;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity var(--primary-during);
      }
    }
    position: relative;
    // 右侧 工具栏
    .tools {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  // 内容区域卡片
  .contain {
    width: 100%;
    display: flex;
    // 内容区域卡片的间距
    gap: $item-gap;
    flex-wrap: wrap;
    justify-content: space-between;
    @include media(sm) {
      justify-content: center;
    }
    // 内容区的卡片
    ::v-deep(.layout-content) {
      flex: 0 0 calc(100% / var(--pages-card-contentNum) - $item-gap);
      transition: transform var(--primary-during),
        flex var(--content-card-flex-during);
      @include media(md) {
        flex: 0 0 calc(100% / (var(--pages-card-contentNum) - 1) - $item-gap);
      }
      @include media(sm) {
        flex: 0 0 calc(100% / (var(--pages-card-contentNum) - 2) - $item-gap);
      }
      @include media(xs) {
        flex: 0 0 calc(100% / (var(--pages-card-contentNum) - 2) - $item-gap);
      }
      @include media(mi) {
        flex: unset;
        width: 100%;
      }
      // 悬浮效果
      &:hover {
        transform: translateY($translate-y);
        .poster {
          transform: scale($pages-poster-scale);
        }
      }
      &:last-child {
        margin-right: auto;
      }
      // 海报
      .poster {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: var(--primary-during) transform;
      }
    }
  }
}
</style>
