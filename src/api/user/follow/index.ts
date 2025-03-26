import request from "@/utils/request"
// 引入类型
// 统一管理 api
enum API {
  // 粉丝列表
  follower = "/user/follow/get/follower",
  // 关注列表
  following = "/user/follow/get/following",
  // 判断 是否关注
  isFollowed = "/user/follow/get/isFollowed",
  // 关注
  add = "/user/follow/add",
  // 取消关注
  del = "/user/follow/del",
}

// API 的 key 的类型
export type APIKeysType = keyof typeof API

// 引入前缀
const prefix = import.meta.env.VITE_API
// 引入服务器
const server = import.meta.env.VITE_SERVE

// 得到粉丝列表
export const getFollower = (userId: number) =>
  request.get<any, any>(server + prefix + API.follower + `/${userId}`)

// 得到关注列表
export const getFollowing = (userId: number) =>
  request.get<any, any>(server + prefix + API.following + `/${userId}`)

// 查询是否关注
export const isFollowed = (followerId: number, followingId: number) =>
  request.get<any, boolean>(
    server +
      prefix +
      API.isFollowed +
      `/${followerId}` +
      `/?followingId=${followingId}`
  )

// 关注
export const addFollow = (userId: number) =>
  request.post<any, any>(server + prefix + API.add + `/${userId}`)

// 取消关注
export const delFollow = (userId: number) =>
  request.delete<any, any>(server + prefix + API.del + `/${userId}`)
