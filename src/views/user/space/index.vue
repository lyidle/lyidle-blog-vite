<template>
  <layout-content ref="layoutRef">
    <template #content-start>
      <my-card class="card_style allDocs">
        <div class="header">
          <!-- 头像 -->
          <div class="avatar-container" v-if="pagination?.total">
            <!-- 头像 -->
            <global-avatar-src
              :account="account"
              :avatar="userInfo?.avatar"
              style="--avatar-size: 80px"
            ></global-avatar-src>
            <div
              class="mask cur-pointer"
              @click="userEditorScene"
              v-author="{ author: account }"
            >
              更换头像
            </div>
          </div>
          <!-- 名字和签名 -->
          <div class="pl-30px flex flex-col justify-center gap-5px h-80px">
            <my-tooltip
              class="box-item"
              effect="dark"
              :content="`作者:${
                userInfo?.id === userId ? userAccount : userInfo?.account
              }`"
              placement="top"
            >
              <div class="cur-text text-24px w-fit">
                {{
                  userInfo?.id === userId ? userNickName : userInfo?.nickName
                }}
              </div>
            </my-tooltip>
            <div class="flex">
              <div class="flex-shrink-0 text-15px cur-text h-20px">
                签名:<span v-if="userInfo?.id !== userId">{{
                  userInfo?.signer
                }}</span>
              </div>
              <my-input
                v-if="userInfo?.id === userId"
                class="h-20px text-10px"
                v-model.trim="signer"
                @blur="updateSinger"
              ></my-input>
            </div>
          </div>
          <!-- 关注和发消息 不能是自身 -->
          <div class="tools" v-if="userId !== userInfo?.id">
            <!-- 关注 -->
            <my-button
              class="p-0px w-125px h-35px pr-5px"
              @click="toFollow"
              v-if="!isFollow"
            >
              <i class="i-mynaui:plus size-18px"></i>
              <span>关注</span>
            </my-button>
            <my-button
              class="p-0px w-125px h-35px pr-5px"
              @click="toDelFollow"
              type="default"
              v-else
            >
              <i class="i-mynaui:plus size-18px"></i>
              <span>取消关注</span>
            </my-button>
            <my-button class="p-0px w-125px h-35px pr-5px">
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
import { searchCounts, updateUserSigner } from "@/api/user"
import { addFollow, delFollow, isFollowed } from "@/api/user/follow"
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
import throttle from "@/utils/throttle"
import { handlerReqErr } from "@/utils/request/error/successError"
// 提取需要的数据
const { userId, userSigner, userToken, userNickName, userAccount } =
  storeToRefs(useUserStore())

// 得到 布局组件的实例
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
    try {
      const result = await searchCounts({ isBin: "true", account })
      userInfo.value = result?.[0]
      signer.value = userInfo.value?.signer || ""
    } catch (error) {
      const err = handlerReqErr(error, "error")
      if (!err) ElMessage("获取用户信息失败")
    }
  }
}

// 存储文章信息
const articles = ref<SearchArticle["data"]["article"]>()
const pagination = ref<Pagination>()
// 得到 文章信息
const reqArticles = async (currentPage: number = 1, pageSize: number = 10) => {
  try {
    const result = await searchArticleExact({
      author: account,
      currentPage,
      pageSize,
    })
    articles.value = result.article
    pagination.value = result.pagination
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage("获取文章信息失败")
  }
}

// 签名
const signer = ref("")
// 更新 签名的 回调
const updateSinger = throttle(async () => {
  try {
    const oldSigner = userSigner.value?.trim()
    // 没有改变签名
    if (oldSigner === signer.value) {
      return
    }
    const result = await updateUserSigner(signer.value)
    userSigner.value = result.signer
    userToken.value = result.token
    ElMessage.success("更新用户签名成功")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("更新用户签名失败")
  }
}, 1000)

// 是否 关注了
const isFollow = ref(false)

// 监听是否有 userId
const stopUserId = watch(
  () => userInfo.value?.id,
  (id) => {
    if (!id) return
    // 初始化是否关注
    isFollowCallback()
    stopUserId()
  }
)

// 是否 关注了
const isFollowCallback = async () => {
  if (!userInfo.value?.id) return
  const result = await isFollowed(userId.value, userInfo.value.id)
  isFollow.value = result
}

// 关注
const toFollow = async () => {
  const id = userInfo.value?.id
  if (!id) return ElMessage("关注失败，id丢失")
  try {
    await addFollow(id)
    isFollow.value = true
    ElMessage.success("关注成功")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("关注失败")
  }
}

// 取消关注
const toDelFollow = async () => {
  const id = userInfo.value?.id
  if (!id) return ElMessage("取消关注失败，id丢失")
  try {
    await delFollow(id)
    isFollow.value = false
    ElMessage.success("取消关注成功")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("取消关注失败")
  }
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
    // 设置 卡片 样式
    @include setCardStyle(--pages, false);
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
