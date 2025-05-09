<template>
  <!-- 头部 -->
  <div class="header" v-if="userInfo?.id">
    <!-- 头像 -->
    <div class="avatar-container">
      <!-- 头像 -->
      <global-avatar-src
        :isTo="false"
        :isCursor="false"
        :account="account"
        :avatar="userInfo?.avatar || null"
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
      <global-name
        class="box-item"
        :account="userInfo?.account"
        :nick="userInfo?.nickName"
        nickClass="text-24px w-fit"
      ></global-name>
      <div class="flex">
        <div class="flex-shrink-0 text-15px cur-text h-20px">
          签名:<span v-if="userInfo?.id !== userId">{{
            userInfo?.signer || "这个人没有签名哦~~"
          }}</span>
        </div>
        <my-input
          v-if="userInfo?.id === userId"
          class="h-20px text-10px"
          v-model.trim="signer"
          placeholder="这个人没有签名哦~~"
          @blur="updateSinger"
        ></my-input>
      </div>
    </div>
    <!-- 关注和发消息 不能是自身 -->
    <div class="tools" v-if="userId !== userInfo?.id && userInfo?.id">
      <!-- 关注 -->
      <layout-space-is-follower
        class="p-0px w-125px h-35px pr-5px"
        :curId="userInfo?.id"
      ></layout-space-is-follower>
      <router-link :to="`/user/msg?to=whisper&id=${userInfo?.id}`">
        <my-button class="p-0px w-125px h-35px pr-5px" type="default">
          <i class="i-mynaui:plus size-18px"></i>
          <span>发消息</span>
        </my-button>
      </router-link>
    </div>
    <global-more-report
      v-model="isShowReport"
      class="absolute right-0"
      v-if="userInfo.id !== userId"
    ></global-more-report>
  </div>
</template>

<script setup lang="ts" name="UserSpaceHeader">
// 引入 api
import { updateUserSigner } from "@/api/user"
import { addReport } from "@/api/user/report"
// 引入 类型
import type { Datum as userInfoType } from "@/api/user/types/searchCountsById"
import type { AddReportBody } from "@/api/user/report/types/addReportBody"
// 引入 hooks
import { useUserEditorScene } from "@/hooks/useUserEditorScene"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 节流
import throttle from "@/utils/throttle"
// 处理错误信息
import { handlerReqErr } from "@/utils/request/error/successError"
// 提取需要的数据
const { userId, userSigner, userToken } = storeToRefs(useUserStore())

// 切换 到编辑用户界面
const userEditorScene = useUserEditorScene()

defineProps<{ account: string }>()
const signer = defineModel<string>("signer")
const userInfo = defineModel<userInfoType>("userInfo")

// 更新 签名的 回调
const updateSinger = throttle(async () => {
  try {
    const oldSigner = userSigner.value?.trim()
    // 没有改变签名
    if (oldSigner === signer.value) {
      return
    }
    const result = await updateUserSigner(signer.value || "")
    userSigner.value = result.signer
    userToken.value = result.token
    ElMessage.success("更新用户签名成功")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("更新用户签名失败")
  }
}, 1000)

// 举报
const isShowReport = ref(false)

const reportConfirm = async (data: AddReportBody) => {
  const userId = userInfo.value?.id
  if (!userId) return ElMessage.error("举报失败，没有userId")
  data.type = "user"
  data.targetUserId = userId
  return await addReport(data)
}
provide("reportConfirm", reportConfirm)
</script>

<style scoped lang="scss">
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
    display: flex;
    align-items: center;
    gap: 15px;
  }
}
</style>
