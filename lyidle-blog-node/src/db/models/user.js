"use strict"
const { Model } = require("sequelize")
//导入bcryptjs模块 加密
const bcrypt = require("bcryptjs")
// 引入验证
const {
  accountReg,
  nickNameReg,
  pwdReg,
  emailReg,
} = require("../../RegExp/loginOrReg/js")

const { join } = require("path")
const { existsSync, rm } = require("fs")

// 引入错误函数
const setDbError = require("../../utils/error/setDbError/js")

const { getKey, setKey } = require("../../utils/redis/js")
/**
 * 更新文章的回调
 * @param {string} mode 模式
 * @param {1 | -1} sym 符号 加减 乘上 1 或 -1
 */
const updateTotalUsers = async (mode, sym) => {
  // 更新字数
  try {
    let count = await getKey("userCounts")
    count = +count || 0
    const updatedCount = parseInt(count + 1 * sym)
    console.log({ mode, count, sym, updatedCount })

    await setKey("userCounts", updatedCount)
  } catch (error) {
    console.error(`${mode}时，更新用户总数到 Redis 中失败:`, error)
  }
}

// 删除时 图片清理逻辑
const handlerDelImgs = async (article, options) => {
  // 软删除退出
  if (!options.force) return
  try {
    // 用户的 文件位置
    const deletePath = join(__dirname, "../../assets/images", `${user.id}`)
    // 存在 路径 则删除路径
    if (existsSync(deletePath)) {
      rm(deletePath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(`删除用户时删除目录出错,userId:${user.id}`, err)
          return
        }
      })
    }
  } catch (error) {
    console.error(`删除用户时删除目录出错,userId:${user.id}`, err)
  }
}

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // 一个用户可以有多篇文章
      this.hasMany(models.Article, {
        as: "articles",
      })

      // 关联角色 通过 UserRole 关联 Role
      this.belongsToMany(models.Role, { through: "UserRoles" })

      // User 和 Comment 之间的一对多关系
      this.hasMany(models.Comment, { foreignKey: "userId", as: "comments" })

      // 用户作为关注者 可查关注列表
      User.belongsToMany(models.User, {
        through: {
          model: models.Follow,
          scope: {
            groupName: null, // 默认作用域
          },
        },
        as: "Following",
        foreignKey: "followerId",
        otherKey: "followingId",
      })

      // 用户作为被关注者 可查粉丝列表
      User.belongsToMany(models.User, {
        through: "Follow",
        as: "Followers",
        foreignKey: "followingId",
        otherKey: "followerId",
      })

      // 用户发送的消息
      this.hasMany(models.Message, {
        foreignKey: "senderId",
        as: "SentMessages",
      })

      // 用户接收的消息
      this.hasMany(models.Message, {
        foreignKey: "receiverId",
        as: "ReceivedMessages",
      })
    }
  }

  User.init(
    {
      account: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "账号不能为空" },
          notEmpty: { msg: "账号不能为空" },
          is: {
            args: accountReg.reg,
            msg: accountReg.msg,
          },
        },
      },
      nickName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "用户名不能为空" },
          notEmpty: { msg: "用户名不能为空" },
          is: {
            args: nickNameReg.reg,
            msg: nickNameReg.msg,
          },
        },
      },
      pwd: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "密码不能为空" },
          notEmpty: { msg: "密码不能为空" },
        },
        // 使用hash加密
        set(value) {
          if (!pwdReg.reg.test(value)) throw new setDbError(pwdReg.msg)
          this.setDataValue("pwd", bcrypt.hashSync(value, 10))
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "邮箱不能为空" },
          notEmpty: { msg: "邮箱不能为空" },
          is: {
            args: emailReg.reg,
            msg: emailReg.msg,
          },
        },
      },
      avatar: DataTypes.TEXT,
      signer: DataTypes.STRING,
      isBin: DataTypes.DATE,
      userProvince: DataTypes.STRING,
      userAgent: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true, // 启用软删除
      deletedAt: "isBin", // 指定软删除字段名称
      // 加上 钩子 处理 User 表的信息
      hooks: {
        // 创建的钩子
        afterCreate: async (article, options) => {
          // 更新 总个数
          updateTotalUsers("创建", 1)
        },
        // 删除的钩子
        afterDestroy: async (user, options) => {
          // 处理 图片清理
          handlerDelImgs(user, options)

          // 检查是否是第一次软删除
          if (article.previous("isBin")) return
          // 检查是否已经删除过（防止重复删除）
          if (!article.get("isBin")) return
          // 更新 总个数
          updateTotalUsers("删除", -1)
        },
        // 恢复时
        afterRestore: async (article, options) => {
          // 检查是否是第一次恢复（即之前确实被软删除过）
          if (!article.previous("isBin")) return
          // 检查是否已经恢复过（防止重复恢复）
          if (article.get("isBin")) return
          // 更新 总个数
          updateTotalUsers("恢复", 1)
        },
      },
    }
  )

  return User
}
