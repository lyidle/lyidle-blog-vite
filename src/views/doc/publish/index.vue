<template>
  <layout-content>
    <template #content-start>
      <my-card class="doc-publish-content">
        <el-form>
          <el-form-item class="!mb-0" label="文章的标题">
            <my-input v-model="test" placeholder="文章的标题"> </my-input>
          </el-form-item>
          <el-form-item class="!mb-0" label="文章的分类">
            <my-input v-model="test" placeholder="文章的分类"> </my-input>
          </el-form-item>
          <el-form-item class="!mb-0" label="文章的标签">
            <my-input v-model="test" placeholder="Account or Email"> </my-input>
          </el-form-item>
          <el-form-item class="!mb-0" label="文章的描述">
            <my-input v-model="test" placeholder="Account or Email"> </my-input>
          </el-form-item>
        </el-form>
        <h3 class="font-normal mb-0 mt-0.625rem mb-0.625rem">文章的内容</h3>
        <div id="vditor-preview" ref="vditorEditor"></div>
      </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="DocumentPublish">
// 引入 编辑器的 hooks
import { useVditorEditor } from "@/hooks/Doc/vditorEditor"
// 引入 编辑器 全屏事件的 处理 hooks
import { useIsFullscreen } from "@/hooks/Doc/vditorEditor/isFullScreen"
const test = ref()
const vditorEditor = ref()
// 使用 hooks
useVditorEditor(vditorEditor)
useIsFullscreen(vditorEditor)
</script>

<style scoped lang="scss">
$content-pd: 0.9375rem 2.5rem;
$toolbar-pl: 5rem;
.doc-publish-content {
  // 设置 卡片 阴影
  @include setCardShadow;
  @include set-el-label(var(--primary-color));
  padding: $content-pd;
  // 设置 编辑器 样式
  #vditor-preview {
    cursor: var(--cursor-text);
  }
}
</style>
