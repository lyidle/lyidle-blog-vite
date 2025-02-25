import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入验证
import { jwtMiddleware, isAdmin } from "@/middleware/auth"
// redis
import { delKey } from "@/utils/redis"
// 引入 去重函数
import { deduplication } from "@/utils/array/deduplication"
// 引入 清除用户缓存的函数
import { resetUserInfo } from "@/utils/redis/resetUserInfo"
// 引入 清除菜单缓存的函数
import { delMenuRoles } from "@/utils/redis/delMenuRoles"
// 引入 验证 模型中 修改了的 属性字段 的函数
import { validateChangedFields } from "@/utils/db/validateChangedFields"
// 引入 模型
const { PermissionGroup, Role, User } = require("@/db/models")

const router = express.Router()

// 引入 环境变量
const default_owner = process.env.default_owner!
const default_admin = process.env.default_admin!

// 更新 权限菜单
router.put(
  "/",
  [jwtMiddleware, isAdmin],
  async (req: Request, res: Response, next: NextFunction) => {
    // 删除缓存 redis 的键
    let cacheKey = `permissionGroup:*`
    const { id, name, desc } = req.body

    // 没有 id、name 返回失败
    if (!id) return res.result(void 0, "id是必传项哦~", false)

    try {
      // 存储查询到的结果

      // 通过id 查找
      let findGroup = await PermissionGroup.findByPk(id, {
        paranoid: false,
        include: [
          {
            model: Role,
            paranoid: false,
            attributes: ["id"],
            through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
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
          },
        ],
      })

      if (!findGroup)
        return res.result(void 0, "没有找到需要更新的权限菜单哦~", false)

      // 得到查询到的  name
      const _name = findGroup.dataValues?.name
      // 找到 了 则更新
      // 限制指定的name 不能修改
      _name !== default_owner &&
        _name !== default_admin &&
        name &&
        findGroup.set("name", name)
      findGroup.set("desc", desc || null)

      // 验证 修改了的 属性字段
      await validateChangedFields(findGroup)

      await findGroup.save()

      // 处理找到的users
      const users = deduplication(
        JSON.parse(JSON.stringify(findGroup)).Roles?.map(
          (item: any) => item.Users
        )
      ).filter(Boolean)

      // 处理找到的roles
      const roles = deduplication(
        users.map((item) => item.Roles?.map((item: any) => item.name))
      ).filter(Boolean) as string[]

      // 删除找到的users的缓存
      await resetUserInfo(users)
      // 删除找到的menus的缓存
      await delMenuRoles(roles)

      // 删除缓存
      await delKey(cacheKey)

      // 限制指定的name 不能修改
      if (_name === default_owner || _name === default_admin)
        return res.result(_name, `不可修改名字为${_name}的权限组哦~`)

      res.result(void 0, "更新权限菜单成功~")
    } catch (error) {
      res.validateAuth(error, next, () =>
        res.result(void 0, "更新权限菜单失败~", false)
      )
    }
  }
)
export default router
