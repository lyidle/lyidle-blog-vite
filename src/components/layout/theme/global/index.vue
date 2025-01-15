<template>
  <div v-if="setScene == 0" class="global-container">
    <div class="item">
      <h2 class="title text-center">主题设置</h2>
      <div class="theme-select">
        <div class="preview">
          <div class="item select-theme">
            <span class="label">预览：主题模式选择</span>
            <my-select v-model="themes" :options="themeOptions"></my-select>
          </div>
          <div class="item" v-if="themes === 'switch'">
            <span
              class="label cur-pointer"
              @click="bannerIsFixed = !bannerIsFixed"
            >
              <span>{{ !isDark ? "暗夜模式" : "白天模式" }}</span>
            </span>
            <my-switch
              v-model="isDark"
              inline-prompt
              :active-icon="dark"
              :inactive-icon="light"
              size="small"
            />
          </div>
          <div class="item">
            <span
              class="label cur-pointer"
              @click="bannerIsFixed = !bannerIsFixed"
            >
              <span>{{ bannerIsFixed ? "背景固定" : "背景悬浮" }}</span>
            </span>
            <my-switch
              v-model="bannerIsFixed"
              inline-prompt
              :active-icon="fixed"
              :inactive-icon="unfixed"
              size="small"
            />
          </div>
        </div>
        <div class="contain">
          <div class="item">
            <span class="label">白天主题设置</span>
            <my-select v-model="lights" :options="lightOptions"></my-select>
          </div>
          <div class="item">
            <span class="label">暗夜主题设置</span>
            <el-select v-model="darks" placeholder="Select" size="small">
              <el-option
                v-for="item in darkOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <h2 class="title text-center">点击特效设置</h2>
      <div class="theme-select">
        <div class="preview">
          <div class="item">
            <span class="label cur-pointer" @click="clickEffect = !clickEffect">
              <span>预览：</span>
              <span>点击特效</span>
            </span>
            <my-switch
              v-model="clickEffect"
              inline-prompt
              :active-icon="click"
              :inactive-icon="unclick"
              size="small"
            />
          </div>
        </div>
        <div class="contain">
          <div class="item">
            <span class="label">点击特效选择</span>
            <my-select v-model="clicks" :options="clickOptions"></my-select>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <h2 class="title text-center">移动特效设置</h2>
      <div class="theme-select">
        <div class="preview">
          <div class="item">
            <span class="label cur-pointer" @click="moveEffect = !moveEffect">
              <span>预览：</span>
              <span>移动特效</span>
            </span>
            <my-switch
              v-model="moveEffect"
              inline-prompt
              :active-icon="move"
              :inactive-icon="unmove"
              size="small"
            />
          </div>
        </div>
        <div class="contain">
          <div class="item">
            <span class="label">移动特效选择</span>
            <my-select v-model="moves" :options="moveOptions"></my-select>
          </div>
        </div>
      </div>
    </div>
    <div class="item">
      <h2 class="title text-center">布局信息设置</h2>
      <div class="theme-select">
        <div class="preview">
          <div class="item">
            <span
              class="label cur-pointer"
              @click="contentIsReverse = !contentIsReverse"
            >
              <span>侧栏位置({{ contentIsReverse ? "左侧" : "右侧" }})</span>
            </span>
            <my-switch
              v-model="contentIsReverse"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
          <div class="item">
            <span
              class="label cur-pointer"
              @click="savePosition = !savePosition"
            >
              <span
                >个性化面板位置({{ savePosition ? "存储" : "不存储" }})</span
              >
            </span>
            <my-switch
              v-model="savePosition"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
        </div>

        <div class="preview">
          <div class="item">
            <span
              class="label cur-pointer"
              @click="docMenuIsFixed = !docMenuIsFixed"
            >
              <span
                >文章页面的目录({{ docMenuIsFixed ? "固定" : "不固定" }})</span
              >
            </span>
            <my-switch
              v-model="docMenuIsFixed"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
        </div>

        <div class="preview">
          <div class="item">
            <span
              class="label cur-pointer"
              @click="docMenuIsFixedLazy = !docMenuIsFixedLazy"
            >
              <el-tooltip class="box-item" effect="dark" placement="top-start">
                <template #content>
                  <div class="w-25rem">
                    默认使用的是监听页面的滚动事件,判断是否固定,
                    会频繁的获取菜单和侧边栏倒数第二个元素的位置信息,
                    会引起页面的回流和重绘,虽然使用了节流,
                    相比禁用布局改变要差一些<br />
                    使用交叉传感器是监听，元素菜单倒数第二个元素,
                    它的进入和离开视口来进行判断是否固定
                  </div>
                </template>
                <span
                  >文章的目录是否使用交叉传感器({{
                    docMenuIsFixedLazy ? "是" : "否"
                  }})</span
                >
              </el-tooltip>
            </span>

            <my-switch
              v-model="docMenuIsFixedLazy"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="item">
      <h2 class="title text-center">布局显示与隐藏设置</h2>
      <div class="theme-select">
        <div class="preview">
          <div class="item" v-if="!docMenuIsFixedLazy">
            <span class="label cur-pointer" @click="isAside = !isAside">
              <span>{{ isAside ? "关闭" : "打开" }}侧边信息</span>
            </span>
            <my-switch
              v-model="isAside"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
          <div class="item">
            <span class="label cur-pointer" @click="isAsideSelf = !isAsideSelf">
              <span>{{ isAsideSelf ? "关闭" : "打开" }}个人信息</span>
            </span>
            <my-switch
              v-model="isAsideSelf"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
          <div class="item">
            <span
              class="label cur-pointer"
              @click="isAsideAnnounce = !isAsideAnnounce"
            >
              <span>{{ isAsideAnnounce ? "关闭" : "打开" }}公告信息</span>
            </span>
            <my-switch
              v-model="isAsideAnnounce"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
        </div>
        <div class="preview">
          <div class="item">
            <span
              class="label cur-pointer"
              @click="isAsideWebInfo = !isAsideWebInfo"
            >
              <span>{{ isAsideWebInfo ? "关闭" : "打开" }}小站咨询</span>
            </span>
            <my-switch
              v-model="isAsideWebInfo"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
          <div class="item">
            <span
              class="label cur-pointer"
              @click="isAsideRecentPage = !isAsideRecentPage"
            >
              <span>{{ isAsideRecentPage ? "关闭" : "打开" }}最新文章信息</span>
            </span>
            <my-switch
              v-model="isAsideRecentPage"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
          <div class="item">
            <span
              class="label cur-pointer"
              @click="isAsideDocMenu = !isAsideDocMenu"
            >
              <span>{{ isAsideDocMenu ? "关闭" : "打开" }}目录</span>
            </span>
            <my-switch
              v-model="isAsideDocMenu"
              inline-prompt
              :active-icon="aside"
              :inactive-icon="unaside"
              size="small"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="LayoutSetting">
// 引入仓库
import { useSettingStore } from "@/store/setting"
// 引入图标
import dark from "@/components/icon/switch/dark.vue"
import light from "@/components/icon/switch/light.vue"
import fixed from "@/components/icon/switch/fixed.vue"
import unfixed from "@/components/icon/switch/unfixed.vue"
import click from "@/components/icon/switch/click.vue"
import unclick from "@/components/icon/switch/unclick.vue"
import move from "@/components/icon/switch/move.vue"
import unmove from "@/components/icon/switch/unmove.vue"
import aside from "@/components/icon/switch/aside.vue"
import unaside from "@/components/icon/switch/unaside.vue"
// 初始化仓库中用到的值
const { setScene } = storeToRefs(useSettingStore())
// 提取需要的变量 全局设置
const {
  isDark,
  bannerIsFixed,
  clickEffect,
  moveEffect,
  isAside,
  contentIsReverse,
  themes,
  lights,
  darks,
  clicks,
  moves,
  savePosition,
  docMenuIsFixed,
  docMenuIsFixedLazy,
  // #region 侧边栏的 显示与否
  isAsideSelf,
  isAsideAnnounce,
  isAsideWebInfo,
  isAsideRecentPage,
  isAsideDocMenu,
  // #endregion 侧边栏的 显示与否
} = storeToRefs(useSettingStore())
const { themeOptions, lightOptions, darkOptions, clickOptions, moveOptions } =
  useSettingStore()
</script>

<style scoped lang="scss">
@use "sass:list";
$gap: 0.3125rem;
$preview-gap: 0.9375rem;
// 上下边距
$title-m-vert: 1.25rem, 0.625rem;
$content-m-l: 3.125rem;
.global-container {
  > .item {
    // 头部
    > .title {
      margin: unset;
      margin-top: list.nth($title-m-vert, 1);
      margin-bottom: list.nth($title-m-vert, 2);
    }
    // 主题设置
    > .theme-select {
      display: flex;
      flex-direction: column;
      gap: $gap;
      // 主题预览 切换
      > .preview {
        display: flex;
        gap: $preview-gap;
        align-items: center;
        margin-left: $content-m-l;
        @include media(sm) {
          margin-left: 0;
        }
        .item {
          display: flex;
          gap: $gap;
          align-items: center;
          &.select-theme {
            // 标签
            .label {
              width: 9.0625rem;
            }
            // 多选框
            .el-select {
              width: 6.25rem;
            }
          }
        }
      }
      // 全部多选框的夫容器
      > .contain {
        display: flex;
        gap: $gap;
        margin-left: $content-m-l;
        > .item {
          display: flex;
          gap: $gap;
          align-items: center;
          // 标签
          .label {
            width: 6rem;
          }
          // 多选框
          .el-select {
            width: 6.25rem;
          }
        }
      }
    }
  }
}
</style>
