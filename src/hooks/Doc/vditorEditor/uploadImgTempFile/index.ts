// 引入 api
/* 
 文件 的上传地址 批量
 图片 的上传地址 单个
*/
import { tempImgFiles, tempImgUrl } from "@/api/img"
// 引入 仓库
import { useUserStore } from "@/store/user"
export const uploadImgTempFile = () => {
  const { userToken } = storeToRefs(useUserStore())
  return {
    // 直接 上传图片的接口
    linkToImgUrl: tempImgUrl,
    // 直接 上传图片的接口 处理返回结果 适配 vditor
    linkToImgFormat: ($res: string): string => {
      const res = JSON.parse($res)
      const { data, message } = res
      const result: any = {
        code: res.code,
        msg: message,
        data: {
          originalURL: data?.origin,
          url: data?.url,
        },
      }

      if (res.code == 401) {
        result.code = 1 //失败
        ElMessage.warning("没有权限上传图片~")
        result.msg = "没有权限上传图片~"
      }

      if (res.code !== 200 && res.code !== 401) {
        result.code = 1 //失败
        result.msg = "上传图片失败"
        ElMessage.error("上传图片失败~")
      }

      if (result.code === 200)
        // 成功的代码是 0 才能插入 链接
        result.code = 0
      ElMessage.success("上传图片成功~")

      const finall = JSON.stringify(result)
      return finall
    },
    headers: { Authorization: `Bearer ${userToken.value}` },
    accept: "image/*", //只允许 image字段
    max: 5 * 1024 * 1024,
    url: tempImgFiles,
    format: (files, $res) => {
      // 解析后端返回的数据
      const res = typeof $res === "string" ? JSON.parse($res) : $res

      const result = {
        code: 0, // Vditor 成功状态码
        msg: res.message || "上传成功",
        data: {
          errFiles: res.data?.errFiles || [],
          succMap: res.data?.succMap || {},
        },
      }

      // 成功
      if (res.code === 200) {
        res.data?.errFiles?.forEach((item: string) =>
          ElMessage.error(`${item}上传失败~`)
        )
        for (const msg in res.data?.succMap) {
          ElMessage.success(`${msg}上传成功~`)
        }
        return JSON.stringify(result)
      }

      // 处理后端返回失败的情况
      const errorResult = {
        code: 1, // Vditor 失败状态码
        msg: res.message || "上传失败",
        data: {
          errFiles: files?.map((file) => file.name), // 全部作为失败文件
          succMap: {},
        },
      }

      errorResult.data.errFiles?.forEach((item) =>
        ElMessage.error(`${item}上传失败~`)
      )
      return JSON.stringify(errorResult)
    },
  } as IUpload
}
