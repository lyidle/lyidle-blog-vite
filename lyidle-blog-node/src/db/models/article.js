"use strict"
const { Model } = require("sequelize")
// 引入验证
const { accountReg } = require("../../RegExp/loginOrReg/js")
const {
  tagsReg,
  titleReg,
  categoryReg,
  descReg,
} = require("../../RegExp/articleReg")

const { deduplication } = require("../../utils/array/deduplication/js")

const { join } = require("path")
const { existsSync, rm } = require("fs")
const { unlink } = require("fs/promises")
const Big = require("big.js")
const { getKey, setKey, delKey } = require("../../utils/redis/js")

/**
 * 更新文章总数量的回调
 * @param {string} mode 模式
 * @param {1 | -1} sym 符号 加减 乘上 1 或 -1
 */
const updateTotalPages = async (mode, sym) => {
  try {
    let count = await getKey("webTotalPages")
    const currentCount = new Big(count || 0)
    const operation = new Big(sym)
    const updatedCount = currentCount.plus(operation).toString()
    await setKey("webTotalPages", updatedCount)
  } catch (error) {
    console.error(`${mode}时，更新文章总总数到 Redis 中失败:`, error)
  }
}

// 创建时 更新字数的 逻辑
const handlerCreateUpdateTotalWorlds = async (article) => {
  try {
    let length = article.get("length")
    length = new Big(length || 0)
    let count = await getKey("webTotalWords")
    count = new Big(count || 0)
    const updatedCount = count.plus(length).toString()
    await setKey("webTotalWords", updatedCount)
  } catch (error) {
    console.error("创建文章时，更新文章的总字数到 Redis 失败:", error)
  }
}

// 更新时 更新字数的 逻辑
const handlerUpdateUpdateTotalWorlds = async (article) => {
  if (article.changed("length")) {
    try {
      let oldLength = article.previous("length")
      oldLength = new Big(oldLength || 0)
      let newLength = article.get("length")
      newLength = new Big(newLength || 0)
      let count = await getKey("webTotalWords")
      count = new Big(count || 0)
      const updatedCount = count.minus(oldLength).plus(newLength).toString()
      await setKey("webTotalWords", updatedCount)
    } catch (error) {
      console.error("更新文章时，更新文章的总字数到 Redis 失败:", error)
    }
  }
}

// 更新时 图片清理逻辑
const handlerUpdateUpdateImgs = async (article) => {
  // 处理 图片清理
  try {
    // 安全获取并扁平化新旧图片URL数组
    const oldImgUrls = article.previous("imgUrls")?.flat(Infinity) || []
    const newImgUrls = article.imgUrls?.flat(Infinity) || []
    // 找出有效且被删除的图片URL
    const deletedImgUrls = oldImgUrls.filter(
      (url) => url?.trim() && !newImgUrls.includes(url)
    )

    if (deletedImgUrls.length === 0) {
      return // 没有需要删除的图片
    }

    // 使用 allSettled 并行处理所有删除操作
    const results = await Promise.allSettled(
      deletedImgUrls.map(async (url) => {
        const deletePath = join(__dirname, "../../assets/images", url)

        if (!existsSync(deletePath)) {
          return { url, status: "skipped", reason: "文件不存在" }
        }

        try {
          await unlink(deletePath)
          return { url, status: "fulfilled", path: deletePath }
        } catch (error) {
          throw { url, error } // 携带上下文信息重新抛出
        }
      })
    )

    // 分析处理结果
    // const stats = {
    //   total: results.length,
    //   succeeded: results.filter((r) => r.status === "fulfilled").length,
    //   skipped: results.filter(
    //     (r) =>
    //       r.status === "rejected" && r.reason?.reason === "文件不存在"
    //   ).length,
    //   failed: results.filter(
    //     (r) => r.status === "rejected" && !r.reason?.reason
    //   ).length,
    // }

    // 记录失败的详细信息（可选）
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          `删除失败: ${result.reason.url}`,
          result.reason.error?.message || result.reason.reason
        )
      }
    })
  } catch (error) {
    console.error("图片清理流程异常:", error)
  }
}

// 删除时 更新字数的 逻辑
const handlerDelUpdateTotalWorlds = async (article) => {
  try {
    let length = article.get("length")
    length = new Big(length || 0)
    let count = await getKey("webTotalWords")
    count = new Big(count || 0)
    const updatedCount = count.minus(length).toString()
    await setKey("webTotalWords", updatedCount)
  } catch (error) {
    console.error("删除文章时，更新文章的总字数到 Redis 失败:", error)
  }
}

// 删除时 图片清理逻辑
const handlerDelUpdateImgs = async (article, options) => {
  // 软删除退出
  if (!options.force) return
  // 处理 图片清理
  try {
    // 文章的 图片位置
    const articlePath = join(
      __dirname,
      "../../assets/images",
      `${article.userId}`,
      "md",
      `${article.articleId}`
    )
    // 存在 路径 则删除路径
    if (existsSync(articlePath)) {
      rm(articlePath, { recursive: true, force: true }, (err) => {
        if (err) {
          console.error(
            `删除文章时删除图片目录出错,userId:${article.userId},articleId:${article.articleId}`,
            err
          )
          return
        }
      })
    }
  } catch (error) {
    console.error(
      `删除文章时删除图片目录出错,userId:${article.userId},articleId:${article.articleId}`,
      error
    )
  }
}

// 恢复时 更新字数的 逻辑
const handlerRestoreUpdateTotalWorlds = async (article) => {
  try {
    const length = article.get("length")
    length = new Big(length || 0)
    const count = await getKey("webTotalWords")
    count = new Big(count || 0)
    const updatedCount = count.plus(length).toString()
    await setKey("webTotalWords", updatedCount)
  } catch (error) {
    console.error("恢复文章时，更新文章的总字数到 Redis 失败:", error)
  }
}

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate(models) {
      // 一篇文章属于一个用户
      this.belongsTo(models.User, {
        foreignKey: "userId", // 指定外键
      })
      // 一篇文章有 阅读时间记录
      this.hasOne(models.ArticleTime, {
        foreignKey: "articleId",
        as: "time",
      })
      // 一篇文章有 浏览量记录
      this.hasOne(models.ArticleCount, {
        foreignKey: "articleId",
        as: "count",
      })
      // 一篇 文章 有多个 评论
      this.hasMany(models.Comment, { foreignKey: "articleId", as: "comments" })

      // 一篇 文章 有多个 点赞
      this.hasMany(models.LikeDislike, {
        foreignKey: "articleId",
        as: "articleLikes",
      })
    }
  }
  Article.init(
    {
      title: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
          notNull: { msg: "文章标题不能为空" },
          notEmpty: { msg: "文章标题不能为空" },
          // 正则限制
          is: {
            args: titleReg.reg,
            msg: titleReg.msg,
          },
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "文章内容不能为空" },
          notEmpty: { msg: "文章内容不能为空" },
        },
      },
      author: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: "文章作者不能为空" },
          notEmpty: { msg: "文章作者不能为空" },
          // 正则限制
          is: {
            args: accountReg.reg,
            msg: "文章作者长度必须在1-32之间",
          },
        },
      },
      category: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notNull: { msg: "文章分类不能为空" },
          notEmpty: { msg: "文章分类不能为空" },
          // 正则限制
          is: {
            args: categoryReg.reg,
            msg: categoryReg.msg,
          },
        },
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
          notNull: { msg: "文章标签不能为空" },
          notEmpty: { msg: "文章标签不能为空" },
          // 自定义验证逻辑
          isArray(value) {
            if (!Array.isArray(value)) {
              throw new Error("文章标签必须是一个数组")
            }
          },
          isNotEmpty(value) {
            if (!value.length) {
              throw new Error("文章标签至少要有一个")
            }
          },
          // 个数
          isLengthValid(value) {
            if (
              value.length < tagsReg.totalMin ||
              value.length > tagsReg.totalMax
            ) {
              throw new Error(tagsReg.msg)
            }
          },
          // 每一项
          isEachItemValid(value) {
            if (value.some((tag) => !tagsReg.itemReg.test(tag))) {
              throw new Error(tagsReg.itemMsg)
            }
          },
        },
        set(value) {
          // 去重
          this.setDataValue("tags", deduplication(value))
        },
      },
      carousel: {
        type: DataTypes.BOOLEAN,
        validate: {
          isBoolean(value) {
            // 校验 value 是否合法
            if (typeof value !== "boolean")
              throw new Error("carousel 必须是布尔值")
          },
        },
      },
      desc: {
        type: DataTypes.STRING,
        validate: {
          // 正则限制
          is: {
            args: descReg.reg,
            msg: descReg.msg,
          },
        },
      },
      poster: DataTypes.TEXT,
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "文章字数不能为空" },
          notEmpty: { msg: "文章字数不能为空" },
          isInt: { msg: "文章字数必须要是个整数" },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "用户id不能为空" },
          notEmpty: { msg: "用户id不能为空" },
          isInt: { msg: "用户id必须要是个整数" },
        },
      },
      isBin: DataTypes.DATE,
      imgUrls: {
        type: DataTypes.JSON,
        validate: {
          // 自定义验证逻辑
          isArray(value) {
            if (value && !Array.isArray(value)) {
              throw new Error("文章图片项必须是一个数组")
            }
          },
        },
        set(value) {
          // 去重
          this.setDataValue("imgUrls", deduplication(value))
        },
      },
      articleId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Article",
      paranoid: true, // 启用软删除
      deletedAt: "isBin", // 指定软删除字段名称
      // 加上 钩子 处理 Article 表的信息
      hooks: {
        // 创建的钩子
        beforeCreate: async (article, options) => {
          // 更新字数
          handlerCreateUpdateTotalWorlds(article, options)
          // 更新 总个数
          updateTotalPages("创建", 1)
        },
        // 更新的钩子
        beforeUpdate: async (article, options) => {
          // 处理 图片清理
          handlerUpdateUpdateImgs(article, options)
          // 需要不是删除的情况
          if (article.get("isBin")) return
          // 更新字数
          handlerUpdateUpdateTotalWorlds(article, options)
        },
        // 删除的钩子
        beforeDestroy: async (article, options) => {
          // 处理 图片清理
          handlerDelUpdateImgs(article, options)
          // 硬删除
          if (article.force) {
            const id = article.id
            // 获取 文章总浏览时间
            const cacheKey = `article-times:${id}`
            // 获取 文章总浏览量
            const cacheKey2 = `article-look:${id}`
            delKey(cacheKey)
            delKey(cacheKey2)
          }
          // 检查是否是第一次删除
          if (article.previous("isBin")) return
          // 更新字数
          handlerDelUpdateTotalWorlds(article, options)
          // 更新 总个数
          updateTotalPages("删除", -1)
        },
        // 恢复时
        beforeRestore: async (article, options) => {
          // 检查是否是第一次恢复（即之前确实被软删除过）
          if (!article.previous("isBin")) return
          // 更新字数
          handlerRestoreUpdateTotalWorlds(article)
          // 更新 总个数
          updateTotalPages("恢复", 1)
        },
      },
    }
  )
  return Article
}
