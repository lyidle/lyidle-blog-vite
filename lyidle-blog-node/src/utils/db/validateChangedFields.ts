/**
 * 验证被修改的字段
 * @param {Model} instance - Sequelize 模型实例
 * @returns {Promise<void>}
 * @throws {ValidationError} 如果验证失败
 */
export const validateChangedFields = async (instance: any) => {
  if (!instance || !instance.changed) {
    throw new Error("验证模型属性时,请传入有效的 Sequelize 实例")
  }

  const changedFields = instance.changed() // 获取被修改的字段列表
  if (changedFields && changedFields.length > 0) {
    await instance.validate({ fields: changedFields }) // 只验证被修改的字段
  }
}
