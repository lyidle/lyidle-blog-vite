"use strict"
const { Model, Op } = require("sequelize")
// 引入 redis
const { delKey } = require("../../utils/redis/js")

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      // 自关联：一个菜单可以有多个子菜单
      this.hasMany(models.Menu, {
        foreignKey: "parentId",
        as: "children",
      })

      // 自关联：一个菜单属于一个父菜单
      this.belongsTo(models.Menu, {
        foreignKey: "parentId",
        as: "parent",
      })

      // 关联角色 通过 MenuRole 关联 Role
      this.belongsToMany(models.Role, { through: "MenuRoles" })
    }
  }

  Menu.init(
    {
      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: "菜单 title 不能为空" },
          notEmpty: { msg: "菜单 title 不能为空" },
          len: { args: [1, 32], msg: "菜单长度必须在1-32之间" },
        },
      },
      icon: DataTypes.TEXT,
      to: DataTypes.STRING,
      layout: DataTypes.JSON,
      isBin: DataTypes.DATE,
      parentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Menu",
      paranoid: true, // 启用软删除
      deletedAt: "isBin", // 指定软删除字段名称
      // 加上 钩子 处理 BannerImg 表的信息
      hooks: {
        // 监听创建操作
        afterCreate: async (menu, options) => {
          // 删除查询所有 `bannerImg:*` 的缓存
          let cacheKey = "bannerImg:*"
          let cacheKey2 = "bannerImg:bin:*"
          // 得到 to 字段
          const to = menu.to
          // 没有 to 则 退出
          if (!to) return
          try {
            // 获取 BannerImg 模型
            const { BannerImg } = menu.sequelize.models

            // 根据 to 字段查找或创建 BannerImg 记录（包括软删除的记录）
            const [bannerImg, created] = await BannerImg.findOrCreate({
              where: { name: to },
              defaults: {
                // 如果不存在，则创建的默认值
                name: to,
                // 其他字段的默认值
              },
              paranoid: false, // 包括软删除的记录
              validate: false, // 跳过验证
            })

            // 如果创建了新记录
            if (created) {
              // 删除缓存
              await delKey(cacheKey)
              await delKey(cacheKey2)
            }
          } catch (error) {
            console.error("在 Menu 的 afterCreate 钩子中发生错误:", error)
          }
        },
        // 监听更新操作
        afterUpdate: async (menu, options) => {
          // 删除查询所有 `bannerImg:*` 的缓存
          let cacheKey = "bannerImg:*"
          let cacheKey2 = "bannerImg:bin:*"
          // 检查 `to` 字段是否变化
          if (menu.changed("to")) {
            // 得到 新旧 to
            const oldTo = menu.previous("to")
            const newTo = menu.to

            try {
              let oldCount = 0
              // 有 oldTo 查询
              if (oldTo)
                // 检查是否还有其他 Menu 记录仍然使用 `oldTo`
                oldCount = await menu.constructor.count({
                  where: {
                    to: oldTo,
                    id: { [Op.ne]: menu.id }, // 排除当前正在更新的这条记录
                  },
                  paranoid: false, // 包括软删除的记录
                })

              let newCount = 0
              // 有 newTO 查询
              if (newTo)
                // 检查是否还有其他 Menu 记录仍然使用 `newTo`
                newCount = await menu.constructor.count({
                  where: {
                    to: newTo,
                    id: { [Op.ne]: menu.id }, // 排除当前正在更新的这条记录
                  },
                  paranoid: false, // 包括软删除的记录
                })

              // 获取 BannerImg 模型
              const { BannerImg } = menu.sequelize.models
              // 当 oldTo 和 newTo 在 menu中都没有时 且 newTo 有值
              if (!oldCount && !newCount && newTo) {
                // 查询是否有 BannerImg name 为 oldTo 的记录（包括软删除的记录）
                const bannerImg = await BannerImg.findOne({
                  where: { name: oldTo },
                  paranoid: false, // 包括软删除的记录
                })
                // 有 oldTo  的背景 则更新
                if (bannerImg) {
                  // 如果记录已存在，则更新记录
                  await bannerImg.update(
                    { name: newTo },
                    {
                      paranoid: false, // 更新时包括软删除的记录
                      validate: false, // 跳过验证
                    }
                  )
                  // 删除缓存
                  await delKey(cacheKey)
                  await delKey(cacheKey2)
                } else {
                  // 没有  则 判断 newTO 没有则创建
                  // 根据 newTo 字段查找或创建 BannerImg 记录（包括软删除的记录）
                  const [bannerImg, created] = await BannerImg.findOrCreate({
                    where: { name: newTo },
                    defaults: {
                      // 如果不存在，则创建的默认值
                      name: newTo,
                      // 其他字段的默认值
                    },
                    paranoid: false, // 包括软删除的记录
                    validate: false, // 跳过验证
                  })

                  // 如果创建了新记录
                  if (created) {
                    // 删除缓存
                    await delKey(cacheKey)
                    await delKey(cacheKey2)
                  }
                }
              }

              // 旧的没有了 新的有  则需要 删除 旧的值
              if (!oldCount && newCount && oldTo) {
                const bannerImg = await BannerImg.findOne({
                  where: { name: oldTo },
                  paranoid: false, // 包括软删除的记录
                })
                // 存在 oldTo 硬删除
                if (bannerImg) {
                  await bannerImg.destroy({ force: true })
                  // 删除缓存
                  await delKey(cacheKey)
                  await delKey(cacheKey2)
                }
              }

              // 当都没有时 且 oldTo还有 则硬删除 oldTo
              if (!oldCount && !newCount && !newTo && oldTo) {
                // 查询是否有 BannerImg name 为 oldTo 的记录（包括软删除的记录）
                const bannerImg = await BannerImg.findOne({
                  where: { name: oldTo },
                  paranoid: false, // 包括软删除的记录
                })
                // 存在 oldTo 硬删除
                if (bannerImg) {
                  await bannerImg.destroy({ force: true })
                  // 删除缓存
                  await delKey(cacheKey)
                  await delKey(cacheKey2)
                }
              }
            } catch (error) {
              console.error("在 Menu 的 afterUpdate 钩子中发生错误:", error)
            }
          }
        },
        // 监听删除操作
        afterDestroy: async (menu, options) => {
          // 删除查询所有 `bannerImg:*` 的缓存
          let cacheKey = "bannerImg:*"
          let cacheKey2 = "bannerImg:bin:*"
          // 得到 to 字段
          const to = menu.to
          // 没有 to 则退出
          if (!to) return

          try {
            // 检查是否还有其他 Menu 记录仍然使用 to
            const count = await menu.constructor.count({
              where: {
                to,
                id: { [Op.ne]: menu.id }, // 排除当前正在删除的这条记录
              },
              paranoid: false, // 包括软删除的记录
            })
            // 如果有其他 Menu 记录使用相同的 to 字段 则 退出
            if (count) return

            // 获取 BannerImg 模型
            const { BannerImg } = menu.sequelize.models

            // 查询是否有 BannerImg name 为 to 的记录（包括软删除的记录）
            const bannerImg = await BannerImg.findOne({
              where: { name: to },
              paranoid: false, // 包括软删除的记录
            })

            // 不存在退出
            if (!bannerImg) return

            // 判断是否是硬删除
            if (options.force) {
              // 如果是硬删除，则使用硬删除
              await bannerImg.destroy({ force: true })
              // 删除 缓存
              await delKey(cacheKey)
              await delKey(cacheKey2)
            } else {
              // 如果是软删除，则使用软删除
              await bannerImg.destroy()
              // 删除 缓存
              await delKey(cacheKey)
              await delKey(cacheKey2)
            }
          } catch (error) {
            console.error("在 Menu 的 afterDestroy 钩子中发生错误:", error)
          }
        },
      },
    }
  )

  return Menu
}
