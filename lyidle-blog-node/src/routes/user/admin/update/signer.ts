import express from "express"
// 设置token
import { setToken } from "@/utils/token"
// 处理roles
import { _handlerRoles, ReturnRoles } from "@/utils/db/handlerRoles"
// 重置user的缓存
import { isOwner, resetUserInfo } from "@/utils/redis/resetUserInfo"
import { validateChangedFields } from "@/utils/db/validateChangedFields"
// 引入 模型
const { User, Role } = require("@/db/models")

const router = express.Router()

/**
 * 更新用户签名信息
 * PUT /user/signer
 *
 * @param {String} signer - 要更新的签名信息
 *
 * @returns {Object} 标准响应格式
 */
router.put("/", async (req, res, next) => {
  const { signer } = req.body
  const userId = req.auth.id // 从认证信息中获取用户ID

  // 验证必填字段
  if (signer === undefined || signer === null) {
    return res.result(void 0, "signer 字段不能为空", false)
  }

  try {
    const findUser = await User.findByPk(userId, {
      paranoid: false,
      include: [
        {
          model: Role,
          paranoid: false,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
    })
    if (!findUser)
      return res.result(void 0, "更新签名信息失败，没有找到用户", false)

    findUser.set("signer", signer?.trim() || "")

    // 验证 修改了的 属性字段
    await validateChangedFields(findUser)

    // 执行更新操作
    const { dataValues } = await findUser.save()
    // 处理 token 字段 的roles
    const tokenSetRoles = ReturnRoles([findUser])
    // 重新生成 token
    let token = await setToken({ ...dataValues, roles: tokenSetRoles })

    // 删除对应用户信息缓存
    await resetUserInfo([findUser], isOwner(tokenSetRoles))

    // 返回成功响应
    res.result({ signer, token }, "签名信息更新成功")
  } catch (error) {
    // 错误处理
    res.validateAuth(error, next, () =>
      res.result(void 0, "更新签名信息失败", false)
    )
  }
})

export default router
