import express from "express"
// 引入类型
import { Request, Response, NextFunction } from "express"
// 引入redis
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
const { PermissionGroup, Permission, Role, User } = require("@/db/models")

const router = express.Router()

// 更新 权限菜单
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
  // 保存 redis 的键
  let cacheKey = `permissions:*`
  // 获取所有角色 保存的键
  const cacheKeyRole = "roles:*"
  // 获取所有权限组 保存的键
  const cacheKeyGroup = `permissionGroup:*`
  // 删除缓存 redis 的键
  const { id, name, desc } = req.body

  // 没有 id、name 返回失败
  if (!id) return res.result(void 0, "id是必传项", false)

  try {
    // 存储查询到的结果

    // 通过id 查找
    let findPermission = await Permission.findByPk(id, {
      paranoid: false,
      include: [
        {
          model: PermissionGroup,
          paranoid: false,
          attributes: ["id"],
          through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
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
                      attributes: ["name"],
                      through: { attributes: [] }, // 不返回中间表 MenuRole 的字段
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    })

    if (!findPermission)
      return res.result(void 0, "没有找到需要更新的权限菜单", false)

    // 找到 了 则更新
    name && findPermission.set("name", name)
    findPermission.set("desc", desc || null)

    // 验证 修改了的 属性字段
    await validateChangedFields(findPermission)

    await findPermission.save()

    // 处理找到的users
    const users = deduplication(
      JSON.parse(JSON.stringify(findPermission)).PermissionGroups?.map(
        (item: any) => item.Roles.map((item: any) => item.Users)
      )
    )
    // 处理找到的roles
    const roles = deduplication(users.map((item: any) => item.Roles)).filter(
      Boolean
    )

    // 删除找到的users的缓存
    await resetUserInfo(users)
    // 删除找到的roles的缓存
    await delMenuRoles(roles)

    // 删除 缓存
    await delKey(cacheKey)
    await delKey(cacheKeyRole)
    await delKey(cacheKeyGroup)
    res.result(void 0, "更新权限菜单成功~")
  } catch (error) {
    res.validateAuth(error, next, () =>
      res.result(void 0, "更新权限菜单失败~", false)
    )
  }
})
export default router
