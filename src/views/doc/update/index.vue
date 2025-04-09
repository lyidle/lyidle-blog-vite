<template>
  <layout-content>
    <template #content-start>
      <my-card class="doc-publish-content relative card_style">
        <el-form :rules="rules" :model="docsFormData" ref="docsForm">
          <el-form-item class="!mb-0">
            <div class="flex justify-end w-100%">
              <my-button
                size="small"
                type="warning"
                @click="$router.replace(`/user/docs/${docAuthor}`)"
                class="w-70px"
                >取消修改</my-button
              >
              <my-button
                size="small"
                class="w-70px"
                v-throttle="{ fn: handerUpload }"
                >更新文章
              </my-button>
            </div>
          </el-form-item>
          <el-form-item
            class="!mb-0 doc-publish-item"
            label="文章的标题"
            prop="title"
          >
            <my-input v-model="docsFormData.title" placeholder="文章的标题">
            </my-input>
          </el-form-item>
          <el-form-item
            class="!mb-0 doc-publish-item"
            label="文章的分类"
            prop="category"
          >
            <my-input v-model="docsFormData.category" placeholder="文章的分类">
            </my-input>
          </el-form-item>
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
            <my-upload
              v-model="poster"
              :auto-remove="false"
              class="ml-10px"
            ></my-upload>
          </el-form-item>
        </el-form>
        <h3 class="font-normal m-20px text-center font-size-1.625rem">
          文章的内容
        </h3>
        <!-- vditor -->
        <vditor-editor
          v-if="isEditor"
          ref="vditorInstance"
          v-model:docHeight="docHeight"
          v-model:context="context"
          v-model:length="length"
          v-model:title="title"
          :isSaveBtn="false"
          :isAutoMount="false"
        ></vditor-editor>
      </my-card>
    </template>
  </layout-content>
</template>

<script setup lang="ts" name="DocumentUpdate">
import { uploadFiles } from "@/components/my/upload/index.vue"
// 压缩 与 解压
import { decompressStringNotError } from "@/utils/compression"
// 引入 api
import { getArticleByAuthorAndId, updateArticle } from "@/api/article"
// 引入 类型
import { UpdateArticleBody } from "@/api/article/types/updateArticleBody"
// 引入 正则
import {
  titleReg,
  categoryReg,
  tagsReg,
  descReg,
  contentReg,
} from "@/RegExp/Docs"
// 引入 hooks
import { useMdReplaceImg } from "@/hooks/Doc/vditorEditor/mdImgToLinkPermanent"
import { mitt } from "@/utils/emitter"
import { postImgPermanent, removeFileStatic } from "@/api/img"
// 引入 处理错误的 请求函数
import { handlerReqErr } from "@/utils/request/error/successError"
// 引入 仓库
import { useUserStore } from "@/store/user"
// 提取需要的数据
const { userAccount } = storeToRefs(useUserStore())
const route = useRoute()
const router = useRouter()
const isEditor = ref(false)

// 上传的 poster图
const poster = ref<uploadFiles>([])
// 初始的 poster图
let originPoster: string | null = null
// 得到 作者和id
const docAuthor = route.query.author as string
const docId = route.query.id as string
// 获取文章数据
const reqArticle = async () => {
  try {
    const Article = await getArticleByAuthorAndId({
      author: docAuthor,
      id: docId,
    })
    if (!Article?.content) {
      mitt.emit("NotFound", "not article")
      return
    }
    docsFormData.title = Article?.title || ""
    docsFormData.category = Article?.category || ""
    docsFormData.tags = Article?.tags || []
    docsFormData.desc = Article?.desc || ""
    if (Article.poster) {
      // 展示poster
      poster.value = [{ name: "", url: Article.poster }]
      // 保存原有的图片
      originPoster = Article.poster
    }

    // 内容尝试解压 失败就展示原内容
    context.value = decompressStringNotError(Article?.content || "") as string
    isEditor.value = true
    // 挂载内容
  } catch (error) {
    mitt.emit("NotFound", "not article")
  }
}

// 文章相关信息
const docHeight = ref("85vh")
const length = ref()
const context = ref<string>("")
const title = ref<string>("")
// vditor 实例
const vditorInstance = ref()

// #region 表单 验证
const docsFormData = reactive<{
  title: Ref<string>
  category: string
  desc: string
  tags: string[]
}>({
  title,
  category: "",
  desc: "",
  tags: [],
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

// 提交的数据整理
const handerUpload = async () => {
  try {
    // 验证 数据
    await docsForm.value.validate()
    // 验证tags
    tagsInstance.value.validate?.()
    // 验证 内容
    if (+(length.value || 0) < contentReg.min) {
      ElMessage.error(contentReg.msg)
      return
    }
    const content = vditorInstance.value.getContext() || ""
    // 整理 数据
    const data: UpdateArticleBody = {
      title: docsFormData.title as string,
      category: docsFormData.category as string,
      tags: docsFormData.tags,
      desc: docsFormData.desc || "",
      content: "",
      length: length.value,
      id: +docId,
    }

    // 处理 临时链接转换
    await useMdReplaceImg(content, data)

    // 判断是否有更新的上传海报
    const newPoster = poster.value?.[0]?.url
    let isUpdatePoster = false
    // 更新了 poster 则修改
    if (newPoster && newPoster !== originPoster) {
      const tempImg = [newPoster]
      const result = await postImgPermanent({
        tempImg,
        account: docAuthor,
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
        if (_poster) {
          data.poster = _poster
          isUpdatePoster = true
        }
      }
    }

    // 更新
    await updateArticle(data)

    // 更新了 原图 且原图存在 则删除
    if (isUpdatePoster && originPoster) {
      try {
        await removeFileStatic([originPoster])
      } catch (error) {}
    }

    ElMessage.success("更新文章成功~")

    router.replace(`/doc/${docId}`)
  } catch (error) {
    // 触发路由守卫 账户不一致事件
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("更新文章失败~")
  }
}
// 挂载
onMounted(async () => {
  // 账号和本地的不一样
  if (userAccount.value !== docAuthor) {
    mitt.emit("account inconsistent", "无权限更新当前文章~")
    return
  }

  await reqArticle()
})
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
