import { postTempImgFiles } from "@/api/img"
import { cloneDeep } from "lodash-es"
import { nanoid } from "nanoid"
import { handlerReqErr } from "../request/error/successError"

// 定义 类型
export type clickUploadNameMapType = { [newName: string]: string }
/**
 * 处理文件上传，返回符合类型限制的 File[] 和文件名映射
 * @param type 文件类型限制（默认为 "image"）
 * @returns 返回一个对象，包含符合类型限制的 File[] 和文件名映射 { files: File[], nameMap: { [newName: string]: string } }
 * 如果未选择文件或类型不匹配，抛出错误
 */
export const clickUpload = async (
  type: string = "image"
): Promise<{ files: File[]; nameMap: clickUploadNameMapType }> => {
  const files = await clickVirtualFile() // 获取用户选择的文件列表

  const filteredFiles: File[] = []
  const nameMap: clickUploadNameMapType = {}

  // 过滤并检查文件类型
  files.forEach((item) => {
    if (!item.files.type.startsWith(type)) {
      // 如果文件类型不匹配，显示错误提示
      ElMessage.error(`文件 ${item.oldName} 类型错误，需要的类型为：${type}`)
      return
    }

    // 将符合类型限制的文件添加到 filteredFiles 中
    filteredFiles.push(item.files)

    // 将新文件名映射到旧文件名
    nameMap[item.files.name] = item.oldName
  })

  // 如果没有符合类型的文件，抛出错误
  if (filteredFiles.length === 0) {
    throw new Error("没有符合类型的文件")
  }

  // 返回符合类型限制的文件列表和文件名映射
  return { files: filteredFiles, nameMap }
}

/**
 * 模拟 input 多选文件上传
 * @returns 返回一个包含原文件名和新文件对象的数组，格式为 { oldName: string, files: File[] }[]
 */
export const clickVirtualFile = async (): Promise<
  { oldName: string; files: File }[]
> => {
  return new Promise((resolve, reject) => {
    // 创建一个 input 元素
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true // 允许选择多个文件

    // 监听 change 事件
    input.addEventListener("change", ($e: Event) => {
      const target = $e.target as HTMLInputElement // 断言为 HTMLInputElement
      const files = target.files // 获取用户选择的文件列表

      if (files && files.length > 0) {
        // 将 FileList 转换为数组，并处理每个文件
        const fileList = Array.from(files).map((file) => {
          const oldName = file.name // 保存原文件名
          const fileExtension = file.name.split(".").pop() // 提取文件扩展名
          const newFileName = `${nanoid()}.${fileExtension}` // 使用 nanoid 生成新文件名，并保留原扩展名
          // 创建新的 File 对象，保留原文件的类型和最后修改时间
          const newFile = new File([file], newFileName, {
            type: file.type,
            lastModified: file.lastModified,
          })

          return {
            oldName, // 原文件名
            files: newFile, // 新文件对象
          }
        })

        resolve(fileList) // 返回处理后的文件列表
      } else {
        reject(new Error("No files selected")) // 如果没有选择文件，返回错误
      }
    })

    // 触发文件选择对话框
    input.click()
  })
}

/**
 * 把 文件 对象 转成 需要的 md 语法 格式 进行 返回
 * @param files 文件对象 File[]
 * @return ![](1)![](2)
 */
export const fileToImgMd = (files: File[]) => {
  return cloneDeep(files)
    .map((item) => nameToMdImg(item.name))
    .filter(Boolean)
    .join("")
}

/**
 *
 * @param name 文件名
 * @returns 返回 md 格式的 图片字符串 ![](name)
 */
export const nameToMdImg = (name: string) => `![](${name})`
/**
 * 处理上传图片信息
 * @param file File[]
 */
export const tempFileUpload = async (
  files: File[],
  options?: {
    errorCallback?: (name: string) => void
  }
): Promise<{ success: [string, string][]; error: string[] } | undefined> => {
  // 初始化 配置项
  let errorCallback: ((name: string) => void) | null = null
  if (options?.errorCallback) {
    errorCallback = options.errorCallback
  }

  try {
    let error: string[] = []

    // 调用 API 上传文件
    const response = await postTempImgFiles(files)
    for (const errorName of response.errFiles) {
      errorCallback?.(errorName)
      if (!errorCallback) ElMessage.error(`上传文件${errorName}失败`)
      error.push(errorName)
    }
    const success = Object.entries(response.succMap)
    if (success.length) return { error, success }
  } catch (error) {
    const err = handlerReqErr(error, "error")
    if (!err) ElMessage.error("上传图片失败~")
    return {
      error: files
        .map((item) => {
          const name = item.name
          errorCallback?.(name)
          if (!errorCallback) ElMessage.error(`上传文件${name}失败`)
          return name
        })
        .filter(Boolean) as string[],
      success: [],
    }
  }
}
