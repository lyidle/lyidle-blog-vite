import axios from "axios"
// 引入 用户仓库
import { useUserStore } from "@/store/user"
// 引入错误处理函数
import { handleErrorMessage } from "./error/getErrorMessage"
import { mitt } from "../emitter"
// 配置
const request = axios.create({
  timeout: 5000,
})

// 添加请求与响应拦截器
request.interceptors.request.use((config) => {
  const { userToken, touristToken } = useUserStore()
  const token = userToken
  const tourist = touristToken
  // 存在token 就携带token发起信息
  if (tourist) config.headers["authorization-tourist"] = `Bearer ${tourist}`
  if (token) config.headers.Authorization = `Bearer ${token}`
  //返回配置对象
  return config
})

request.interceptors.response.use(
  (response) => {
    // 简化数据 直接得到data
    if (response.data.code === 200) return response.data?.data
    if (response.data.code === 401) {
      const { userToken } = useUserStore()
      const token = userToken
      // 如果没有 token 且状态码为 401，不进行错误提示
      if (!token) return response.data
      // 有 token  且 为 401 则需要清除 信息等操作
      if (token) {
        mitt.emit("token expired")
        return
      }
    }
    return Promise.reject(response.data)
  },
  (error) => {
    // 处理错误信息
    return handleErrorMessage(error)
  }
)
// 对外暴露
export default request
