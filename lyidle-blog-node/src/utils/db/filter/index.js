"use strict"

const { Mint } = require("mint-filter")

class FilterWords {
  #mint = null
  #isInit = false
  // 初始化
  async init(words) {
    if (this.#isInit) throw new Error("敏感词库不能重复初始化")
    this.#mint = new Mint(words || [])
    this.#isInit = true
  }

  // 添加
  add(word) {
    if (!this.#isInit || !this.#mint) throw new Error("敏感词库未初始化")
    this.#mint.add(word)
  }

  // 批量添加
  addList(words) {
    if (!this.#isInit || !this.#mint) throw new Error("敏感词库未初始化")
    if (!Array.isArray(words)) return
    words.forEach((word) => this.#mint.add(word))
  }

  // 删除
  delete(word) {
    if (!this.#isInit || !this.#mint) throw new Error("敏感词库未初始化")
    this.#mint.delete(word)
  }

  // 过滤
  filter(word) {
    if (!this.#isInit || !this.#mint) throw new Error("敏感词库未初始化")
    return this.#mint.filter(word).text
  }

  // 验证
  verify(word) {
    if (!this.#isInit || !this.#mint) throw new Error("敏感词库未初始化")
    return this.#mint.verify(word)
  }

  // 验证 并返回未通过的字段
  verifyPlus(word) {
    if (!this.#isInit || !this.#mint) throw new Error("敏感词库未初始化")
    // 不需要替换
    const filters = this.#mint.filter(word, { replace: false }).words
    // 没有 敏感词的 则通过
    if (!filters.length) return false
    // 没有通过的则 返回没有通过的词组
    return filters
  }

  hasInit() {
    return this.#isInit
  }
}

// 导出单例实例
module.exports = new FilterWords()
