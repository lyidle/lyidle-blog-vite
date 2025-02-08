<template>
  <el-upload
    v-model:file-list="fileList"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :before-remove="handleRemove"
    :http-request="handlerUpload"
    :limit="1"
    drag
    class="ml-10px"
    :class="$attrs.class"
  >
    <i class="i-ep:plus w-20px h-20px"></i>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>

<script lang="ts" setup name="MyUpload">
// 引入  api
import { postTempImgFiles } from "@/api/img"
// 引入 处理删除文件的函数
import { handlerRemoveFileStatic } from "@/utils/req/removeFileStatic"
// 类型
import type { UploadProps, UploadUserFile } from "element-plus"

export type uploadFiles = UploadUserFile[]

// 接收 v-model
// 展示的图片
const fileList = defineModel<uploadFiles>()
const props = withDefaults(defineProps<{ remove?: boolean }>(), {
  remove: true,
})
// 是否显示添加框
const isShowPlus = computed(() => {
  return Array.isArray(fileList.value) && fileList.value.length
    ? "none"
    : "block"
})

const dialogImageUrl = ref("")
const dialogVisible = ref(false)

// 删除的回调
const handleRemove: UploadProps["beforeRemove"] = async (uploadFile) => {
  if (!props.remove) return true
  const url = uploadFile.url ? [uploadFile.url] : null
  if (url) return await handlerRemoveFileStatic(url)
  else return false
}

// 预览图片
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 处理上传
const handlerUpload: UploadProps["httpRequest"] = async (options) => {
  const { file } = options // 获取上传的文件
  try {
    // 调用 API 上传文件
    const response = await postTempImgFiles([file as File])

    // 只获取 `succMap` 的第一个文件
    const firstEntry = Object.entries(response.succMap)[0] // 取第一个键值对
    if (firstEntry) {
      const [fileName, fileUrl] = firstEntry
      const newFile: UploadUserFile = {
        name: fileName,
        url: fileUrl,
      }

      ElMessage.success(`上传图片${newFile.name}成功~`)
      // 展示图片
      fileList.value = [newFile]
    }

    // 处理失败的文件列表
    if (response.errFiles && response.errFiles.length > 0) {
      fileList.value = []
      response.errFiles.forEach((item) => ElMessage.error(`${item} 上传失败~`))
    }
  } catch (error: any) {
    fileList.value = []
  }
}
</script>
<style lang="scss">
.el-upload--picture-card {
  display: v-bind(isShowPlus) !important;
  background: unset;
  border: unset;
  .el-upload-dragger {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: var(--cursor-pointer);
  }
}
</style>
