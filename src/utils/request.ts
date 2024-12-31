import axios from "axios"
import { useUserStore } from "@/store/user"
// 第一步：利用axios对象的create方法，去创建axios实例（其他的配置：基础路径、超时的时间）
const request = axios.create({
  timeout: 5000,
})
// 第二步：req实例添加请求与响应拦截器
request.interceptors.request.use((config) => {
  const { userInfo } = storeToRefs(useUserStore())
  //config配置对象，headers属性请求头，经常给服务器端携带公共参数
  const token = userInfo.value?.token
  // 存在token 就携带token发起信息
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  //返回配置对象
  return config
})
request.interceptors.response.use(
  (response) => {
    // 简化数据 直接得到data
    // 这里的状态码是后端返回的状态码
    if (response.data.code === 200) return response.data?.data || response.data
    else {
      const { userInfo } = storeToRefs(useUserStore())
      //config配置对象，headers属性请求头，经常给服务器端携带公共参数
      const token = userInfo.value?.token
      // 错误状态码汇总
      const errorCode = [400, 401, 403]
      // 如果没有token 则 401 不报错
      if (!token && response.data.code === 401) return response.data?.message
      // 错误提示信息 服务器有返回信息
      if (errorCode.includes(response.data.code)) {
        response.data?.message?.forEach((item: string) => {
          ElMessage.error(item)
        })
        return response.data?.message
      }
    }
    // 返回其他错误信息
    throw new Error(response.data.message)
  },
  (error) => {
    // 错误信息
    let message = ""
    // 状态码
    const status = error.status
    // 根据状态码返回信息
    switch (status) {
      case 400:
        message = "请求有误哦~"
        break
      case 401:
        message = "TOKEN过期哦~"
        break
      case 403:
        message = "没有权限访问哦~"
        break
      case 404:
        message = "请求地址错误哦~"
        break
      case 500:
        message = "服务器出现问题哦~"
        break
    }
    error.response?.data?.message?.forEach((item: string) => {
      ElMessage.error(item)
      return
    })
    // 否则 则使用
    return Promise.reject(
      error?.response?.data.message || new Error(message || "网络出现问题")
    )
  }
)
// 对外暴露
export default request
