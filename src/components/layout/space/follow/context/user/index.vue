<template>
  <div class="user flex gap-20px">
    <!-- 头像 -->
    <global-avatar-src
      :account="user.account"
      :avatar="user.avatar"
      style="--avatar-size: 80px"
    ></global-avatar-src>
    <!-- 用户信息 -->
    <div class="flex flex-col justify-between">
      <global-name
        class="box-item"
        :account="user.account"
        :nick="user.nickName"
        nickClass="w-fit"
      ></global-name>
      <div class="text-13px cur-text">
        {{ user.signer || "这个人没有简介哦~~" }}
      </div>
      <div class="flex items-center gap-5px">
        <layout-space-is-follower
          class="w-70px"
          :curId="user.id"
          :isFollower
          :isFollow="user.isFollow"
        ></layout-space-is-follower>
        <div class="follow-more relative">
          <global-header-item top="20px">
            <i
              class="i-ant-design:more-outlined w-20px h-20px cur-pointer opacity-0 more !hover:color-[var(--primary-links-hover)]"
            ></i>
            <template #menu-default>
              <my-menu-item>
                <my-anchor :to="'/test'" class="w-100px text-center">
                  <span>发私信</span>
                </my-anchor>
              </my-menu-item>
            </template>
          </global-header-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="UserSpaceFolloweContextUser">
// 类型
import type { GetFollowUser } from "@/api/user/follow/types/getFollowUser"

defineProps<{ user: GetFollowUser["data"]["users"][0]; isFollower: boolean }>()
</script>

<style scoped></style>
