// 引入 模型
const { Article, User, Role } = require("@/db/models")
// 引入 清除 Users 的信息 缓存
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
/**
 * 通过 文章的id 清除 User 的信息 缓存
 * @param id 查询文章的id
 */
export const resetUserInfoByArticlePk = async (id: number) => {
  const article = await Article.findByPk(id, {
    include: [
      {
        model: User,
        attributes: ["id", "account"],
        include: [
          {
            model: Role,
            attributes: ["name"],
          },
        ],
      },
    ],
  })
  const user = JSON.parse(JSON.stringify(article)).User
  // 清除 Users 的信息 缓存
  await resetUserInfo([user])
}
