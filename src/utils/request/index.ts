import axios from "axios"
// 引入 用户仓库
import { useUserStore } from "@/store/user"
// 引入错误处理函数
import { handleErrorMessage } from "./error/getErrorMessage"
import { handlerSuccessErrorMessage } from "./error/successError"
// 配置
const request = axios.create({
  timeout: 5000,
})

// 添加请求与响应拦截器
request.interceptors.request.use((config) => {
  const { userToken } = storeToRefs(useUserStore())
  const token = userToken.value
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
    if (response.data.code === 200) return response.data?.data
    handlerSuccessErrorMessage(response)
  },
  (error) => {
    // 处理错误信息
    handleErrorMessage(error)
  }
)
// 对外暴露
export default request
