<template>
  <!-- 大屏和小屏都有的部分 -->
  <!-- 首页 -->
  <li>
    <router-link to="/home">
      <i class="i-ep:home-filled w-1em h-1em"> </i>
      首页
    </router-link>
  </li>
  <!-- 消息 -->
  <global-header-item v-if="userId">
    <my-anchor
      to="/user/msg?to=whisper"
      class="item-msg"
      @mouseenter="delMsgCountsMark"
    >
      <i class="i-formkit:email w-1em h-1em"></i>
      消息
      <div class="tip-dot" v-if="msgCounts">{{ msgCounts }}</div>
    </my-anchor>
    <template #menu-default>
      <my-menu-item>
        <my-anchor to="/user/msg?to=reply" class="w-100px text-center">
          <span>回复我的</span>
        </my-anchor>
      </my-menu-item>
      <my-menu-item>
        <my-anchor to="/user/msg?to=at" class="w-100px text-center">
          <span>@我的</span>
        </my-anchor>
      </my-menu-item>
      <my-menu-item>
        <my-anchor to="/user/msg?to=like" class="w-100px text-center">
          <span>收到的赞</span>
        </my-anchor>
      </my-menu-item>
      <my-menu-item>
        <my-anchor to="/user/msg?to=system" class="w-100px text-center">
          <span>我的消息</span>
        </my-anchor>
      </my-menu-item>
    </template>
  </global-header-item>
  <!-- 笔记 -->
  <layout-header-notes></layout-header-notes>
  <slot name="scend"></slot>
  <!-- 个人项 -->
  <global-header-item
    v-model:data="PersonData"
    icon="i-iconoir:page-star"
    name="个人"
  >
  </global-header-item>
  <slot name="last-scend"></slot>
  <!-- 设置项 -->
  <li>
    <global-setting
      right="-10px"
      top="50px"
      :triangle="{ right: '20px', left: 'unset' }"
    >
    </global-setting>
  </li>
  <slot name="last"></slot>
</template>

<script setup lang="ts" name="TopNavNormal">
// 使用 hoooks 处理 个人选项卡的显示
import { delNewUserMsg } from "@/api/user/msg"
import { useShowPersonHeaderMenu } from "@/hooks/header/showPersonHeaderMenu"
// 引入 仓库
import { useUserStore } from "@/store/user"
import { mitt } from "@/utils/emitter"
import { handlerReqErr } from "@/utils/request/error/successError"
import throttle from "@/utils/throttle"
// 个人页面
const PersonData = useShowPersonHeaderMenu()

// 提取数据
const { userId } = storeToRefs(useUserStore())

const msgCounts = ref(0)

// 监听是否有消息 获取个数
mitt.on("msgCounts", async (counts: number) => {
  msgCounts.value = counts || 0
})

// 清除 消息的标记
const delMsgCountsMark = throttle(async () => {
  // 没有新消息 退出
  if (!msgCounts) return
  try {
    await delNewUserMsg()
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("清除当前用户的消息状态失败")
  }
}, 1000)
</script>

<style scoped lang="scss">
@use "sass:math";
.item-msg {
  position: relative;
  > .tip-dot {
    $color: #f8fcff;
    $bg: #fd5a80;
    $text-size: 13px;
    $size: 20px;
    width: $size;
    height: $size;
    position: absolute;
    top: math.div($size, 3);
    right: -$size + 2px;
    border-radius: 50%;
    overflow: hidden;
    text-align: center;
    line-height: $size;
    font-size: $text-size;
    background-color: $bg;
    color: $color;
  }
}
</style>
