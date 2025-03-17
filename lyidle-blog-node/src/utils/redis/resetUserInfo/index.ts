// 引入 redis
import { delKeys } from ".."
// 引入 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 引入 模型
const { Article, User, Role } = require("@/db/models")
// 环境变量
const default_owner = process.env.default_owner!

/**
 * 判断 是否是owner
 * @param roles string[]
 * @returns boolean
 */
export const isOwner = (roles: string[]) => roles.includes(default_owner)

/**
 * 清除 Users 的信息 缓存
 * @param findUsers 查找到的user是一个数组
 * @param roles string[] 各式的 角色
 */
export const resetUserInfo = async (findUsers: any[], isOwner?: boolean) => {
  const users = JSON.parse(JSON.stringify(findUsers))
  // 是否包含owner
  let isOwnerRole: boolean = isOwner || false
  // 需要删除 的数组 去重加 过滤
  const deleteArr = deduplication([
    users.map((item: any) => {
      // 找到 user中有owner的 改变 isOwnerRole true
      !isOwnerRole &&
        item.Roles.find((item: any) => {
          if (item.name === default_owner) {
            isOwnerRole = true
          }
        })
      return [item.id, item.account]
    }),
    isOwnerRole && default_owner,
  ]).filter(Boolean)

  // 判断是否需要和删除缓存
  if (deleteArr && deleteArr.length) {
    await Promise.allSettled([
      // 删除 缓存
      delKeys("userInfo:", deleteArr, (keys) => keys),
      delKeys("userInfo:bin:", deleteArr, (keys) => keys),
    ])
  }
}

/**
 * 通过 文章的id 清除 User 的信息 缓存
 * 创建文章时 使用
 * @param id 查询文章的id
 */
export const resetUserInfoByArticlePk = async (id: number) => {
  const article = await Article.findByPk(id, {
    paranoid: false,
    attributes: ["id"],
    include: [
      {
        model: User,
        paranoid: false,
        attributes: ["id", "account"],
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["name"],
          },
        ],
      },
    ],
  })
  // 得到 user
  const user = JSON.parse(JSON.stringify(article)).User
  // 删除对应用户信息缓存
  await resetUserInfo([user])
}
