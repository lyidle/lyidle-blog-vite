import axios from "axios"

// 统一管理 api
enum API {
  poetry = "/admin/poetry",
}

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

export const getSentence = () => axios.get(server + prefix + API.poetry)
