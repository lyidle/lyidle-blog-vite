<template>
  <layout-content>
    <template #content-start>
      <my-card class="doc-publish-content card_style relative">
        <el-form :rules="rules" :model="docsFormData" ref="docsForm">
          <!-- 左侧按钮 -->
          <el-form-item class="!mb-0">
            <div class="flex justify-end w-100%">
              <my-button
                size="small"
                type="danger"
                @click="resetDoc"
                class="w-70px"
                >重置表单</my-button
              >
              <my-button
                size="small"
                class="w-70px"
                v-throttle="{ fn: handerUpload }"
                >提交文章</my-button
              >
            </div>
          </el-form-item>
          <!-- 文章的标题 -->
          <el-form-item
            class="!mb-0 doc-publish-item"
            label="文章的标题"
            prop="title"
          >
            <my-input v-model="docsFormData.title" placeholder="文章的标题">
            </my-input>
          </el-form-item>
          <!-- 文章的分类 -->
          <el-form-item
            class="!mb-0 doc-publish-item"
            label="文章的分类"
            prop="category"
          >
            <my-input v-model="docsFormData.category" placeholder="文章的分类">
            </my-input>
          </el-form-item>
          <!-- 文章的标签 -->
          <el-form-item
            class="!mb-0 is-required doc-publish-item"
            label="文章的标签"
          >
            <my-tags
              v-model="docsFormData.tags"
              ref="tagsInstance"
              repeatError="标签不能重复"
              :error="tagsReg.msg"
              class="ml-0.625rem"
            ></my-tags>
          </el-form-item>
          <!-- 文章的描述 -->
          <el-form-item
            class="!mb-0 doc-publish-item"
            label="文章的描述"
            prop="desc"
          >
            <my-input v-model="docsFormData.desc" placeholder="文章的描述">
            </my-input>
          </el-form-item>
          <!-- poster -->
          <el-form-item
            class="!mb-0 doc-publish-item ml-11px"
            label="文章的海报"
          >
            <my-upload v-model="poster" class="ml-10px"></my-upload>
          </el-form-item>
        </el-form>
        <!-- 文章的内容 -->
        <h3 class="font-normal m-20px text-center font-size-1.625rem">
          文章的内容
        </h3>
        <!-- vditor -->
        <vditor-editor
          ref="vditorInstance"
          v-model:docHeight="docHeight"
          v-model:context="context"
          v-model:length="length"
          v-model:title="title"
        ></vditor-editor>
      </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="DocumentPublish">
// 引入 utils
import { useMdReplaceImg } from "@/hooks/Doc/vditorEditor/mdImgToLinkPermanent"
// 引入 处理删除文件的函数
import { handlerRemoveFileStatic } from "@/utils/req/removeFileStatic"
// 引入 仓库
import { useDocEditorOpt } from "@/store/doc"
import { useUserStore } from "@/store/user"
// 引入 api
import { addArticle } from "@/api/article"
// 引入 类型
import type { AddArticleBody } from "@/api/article/types/addArticleBody"
// 引入 正则
import {
  titleReg,
  categoryReg,
  tagsReg,
  descReg,
  contentReg,
} from "@/RegExp/Docs"
import { postImgPermanent } from "@/api/img"
import { handlerReqErr } from "@/utils/request/error/successError"

// 提取需要的数据
const { title, category, tags, desc, length, docHeight, context, poster } =
  storeToRefs(useDocEditorOpt())
const { userAccount } = storeToRefs(useUserStore())

// vditor 实例
const vditorInstance = ref()

// 重置表单
const resetDoc = async () => {
  const urls = poster.value?.[0]?.url
  if (
    urls ||
    title.value ||
    category.value ||
    tags.value.length ||
    desc.value
  ) {
    // 默认使用的 store 中的响应式数据 重置表单无法生效
    title.value = ""
    category.value = ""
    tags.value = []
    desc.value = ""
    // 使用 定时器 在 微任务后清除验证
    setTimeout(() => {
      docsForm.value.clearValidate()
    }, 0)

    if (urls) {
      await handlerRemoveFileStatic([urls], {
        error: (url) => {
          // 删除失败 说明临时图片没有了
          poster.value = []
          ElMessage.warning({
            message: `删除文件${url}失败,临时图片被销毁了`,
          })
        },
        success: (url) => {
          if (url === urls) poster.value = []
        },
      })
    }

    ElMessage.success("重置表单成功~")
  }
}

// #region 表单 验证
const docsFormData = reactive({
  title,
  category,
  desc,
  tags,
})
// 表单组件实例
const docsForm = ref()
// tags的组件实例
const tagsInstance = ref()
// 表单规则
const rules = reactive({
  title: [
    {
      required: true,
      message: "标题不能为空",
      trigger: "change",
    },
    {
      pattern: titleReg.reg,
      message: titleReg.msg,
      trigger: "change",
    },
  ],
  category: [
    {
      required: true,
      message: "文章分类不能为空",
      trigger: "change",
    },
    {
      pattern: categoryReg.reg,
      message: categoryReg.msg,
      trigger: "change",
    },
  ],
  desc: [
    {
      required: true,
      message: "文章描述不能为空",
      trigger: "change",
    },
    {
      pattern: descReg.reg,
      message: descReg.msg,
      trigger: "change",
    },
  ],
})
// #endregion 表单 验证

// 使用 路由
const router = useRouter()

// 成功 上传清空缓存
const mdAndFormReset = () => {
  title.value = ""
  category.value = ""
  tags.value = []
  desc.value = ""
  poster.value = []
  context.value = ""
  // 使用 定时器 在 微任务后清除验证
  setTimeout(() => {
    docsForm.value?.clearValidate?.()
  }, 0)
}

// 提交的数据整理
const handerUpload = async () => {
  try {
    // 验证 数据
    await docsForm.value.validate()
    // 验证tags
    tagsInstance.value.validate?.()
    // 得到 内容
    const content = vditorInstance.value.getContext() || ""
    // 验证 内容
    if (+(length.value || 0) < contentReg.min) {
      ElMessage.error(contentReg.msg)
      return
    }
    // 整理 数据
    const data: AddArticleBody = {
      title: docsFormData.title as string,
      category: docsFormData.category as string,
      tags: docsFormData.tags,
      desc: docsFormData.desc || "",
      content: "",
      length: length.value,
    }

    // 处理 临时链接转换
    const handlered = await useMdReplaceImg(content, data)
    console.log(handlered)

    // 判断是否有上传海报
    if (poster.value.length) {
      const tempImg = [poster.value[0].url as string]
      const result = await postImgPermanent({
        tempImg,
        account: userAccount.value as string,
        path: "/md/poster",
      })
      if (result) {
        const { successImg, tempImgNull } = result
        // 临时图片失效的
        if (tempImgNull.length) {
          tempImgNull.forEach((item) => {
            ElMessage.warning({
              message: `文章的海报临时图片:${item}不存在~`,
            })
          })
        }
        // 得到 成功的poster
        const _poster = successImg?.[0]?.url
        // 修改 poster
        if (_poster) data.poster = _poster
      }
    }

    const result = await addArticle(data)
    const docId = result?.id
    if (docId) {
      router.replace(`/doc/${docId}`)
      mdAndFormReset()
    }
    ElMessage.success("发布文章成功~")
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("发布文章失败~")
  }
}
</script>
<style scoped lang="scss">
@use "sass:map";
$content-pd: 0.9375rem 2.5rem;
$toolbar-pl: 5rem;
$item-gap-v: 0.8125rem;
// 设置 卡片 样式
@include setCardStyle;
.doc-publish-content {
  @include set-el-label(var(--primary-color));
  padding: $content-pd;
  .doc-publish-item {
    margin-top: $item-gap-v;
  }
  // tags的input宽度
  ::v-deep(.tags-input) {
    input {
      width: 5rem;
    }
  }
}
</style>
