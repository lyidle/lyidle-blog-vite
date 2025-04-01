import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// redis
import { delKey } from "@/utils/redis"
// 引入 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 清除 用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 清除菜单缓存 的函数
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 验证 模型中 修改了的 属性字段 的函数
import { validateChangedFields } from "@/utils/db/validateChangedFields"
// 引入 模型
const { Role, User } = require("@/db/models")

// 引入 环境变量
const default_owner = process.env.default_owner!
const default_admin = process.env.default_admin!
const default_user = process.env.default_user!

const router = express.Router()

// 更新 角色
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 获取所有角色 保存的键
    const cacheKey = "roles:*"
    const { id, name, desc } = req.body
    // 没有 id、name 返回失败
    if (!id) return res.result(void 0, "id是必传项", false)

    try {
      // 通过id 查找
      let findRole = await Role.findByPk(id, {
        paranoid: false,
        include: [
          {
            model: User,
            paranoid: false,
            attributes: ["id", "account"],
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
            include: [
              {
                model: Role,
                paranoid: false,
                attributes: ["name"], // 只获取角色名称
                through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
              },
            ],
          },
        ],
      })

      if (!findRole) return res.result(void 0, "没有找到需要更新的角色", false)

      // 得到 name
      const _name = findRole.name
      const isName =
        (_name === default_owner && name !== default_owner && default_owner) ||
        (_name === default_admin && name !== default_admin && default_admin) ||
        (_name === default_user && name !== default_user && default_user)
      // 限制指定的name 不能修改
      if (isName)
        return res.result(
          void 0,
          `更新角色失败,不能修改角色为${isName}的名字`,
          false
        )

      findRole.set("name", name)
      findRole.set("desc", desc || null)

      // 验证 修改了的 属性字段
      await validateChangedFields(findRole)

      await findRole.save()

      const _Role = JSON.parse(JSON.stringify(findRole))
      // 处理找到的users
      const users = deduplication(_Role.Users).filter(Boolean)
      // 处理找到的roles
      const roles = deduplication(
        _Role.Users?.map((item: any) =>
          item.Roles?.map((item: any) => item.name)
        )
      ).filter(Boolean)

      // 删除 找到 的Menu用到的缓存
      await delMenuRoles(roles)
      // 删除找到的users的缓存
      await resetUserInfo(users)

      // 删除缓存
      await delKey(cacheKey)

      // 限制指定的name 不能修改
      if (_name === default_owner || _name === default_admin)
        return res.result(_name, `不可修改名字为${_name}的角色`)

      res.result(void 0, "更新角色成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "更新角色失败~", false)
      )
    }
  }
)
export default router
