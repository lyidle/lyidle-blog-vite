// 引入  api
import { removeFileStatic } from "@/api/img"
export const handlerRemoveFileStatic = async (
  url: string[],
  opt?: {
    error?: (url: string) => void
    success?: (url: string) => void
  }
) => {
  try {
    // 没有链接
    if (!url.length) return
    // 从返回结果中提取成功和失败的结果
    const { successMap, errorMap } = await removeFileStatic(url)
    // 成功的
    if (successMap.length)
      for (let i = 0; i < successMap.length; i++) {
        const item = successMap[i]
        // 成功回调
        const res = opt?.success && opt?.success(item)
        if (!res) ElMessage.success(`删除文件${item}成功~`)
        return
      }
    // 错误的
    if (errorMap.length)
      for (let i = 0; i < errorMap.length; i++) {
        const item = errorMap[i]
        // 失败回调
        const res = opt?.error && opt?.error(item)
        if (!res)
          ElMessage.warning({
            message: `删除文件${item}失败~`,
            customClass: "selectMessage",
          })
        return
      }
    // 错误
    return
  } catch (error) {
    // 错误
    return
  }
}
