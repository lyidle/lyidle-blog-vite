import request from "@/utils/request"
// 引入类型
import { GetFollower } from "./types/getFollower"
import { GetFollowUser } from "./types/getFollowUser"
// 统一管理 api
enum API {
  // 关注列表
  follower = "/user/follow/get/follower/",
  // 粉丝列表
  following = "/user/follow/get/following",
  // 关注列表
  followerCounts = "/user/follow/get/follower/counts",
  // 粉丝列表
  followingCounts = "/user/follow/get/following/counts",
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

// 得到关注列表
export const getFollower = (data: GetFollower) =>
  request.get<any, GetFollowUser["data"]>(
    server + prefix + API.follower + `/?${new URLSearchParams(data)}`
  )

// 得到粉丝列表
export const getFollowing = (userId: number) =>
  request.get<any, GetFollowUser["data"]>(
    server + prefix + API.following + `/${userId}`
  )

// 得到关注数量
export const getFollowerCounts = (userId: number) =>
  request.get<any, number>(server + prefix + API.followerCounts + `/${userId}`)

// 得到粉丝数量
export const getFollowingCounts = (userId: number) =>
  request.get<any, number>(server + prefix + API.followingCounts + `/${userId}`)

/**
 * 查询是否关注
 * @param followerId userId
 * @param followingId 需要查询的用户
 * @returns boolean
 */
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
  request.post<any, void>(server + prefix + API.add + `/${userId}`)

// 取消关注
export const delFollow = (userId: number) =>
  request.delete<any, void>(server + prefix + API.del + `/${userId}`)
