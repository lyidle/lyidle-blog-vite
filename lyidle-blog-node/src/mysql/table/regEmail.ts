import { DataTypes } from "sequelize"
const db = require("../index")
const RegEmail = db.define(
  "RegEmail",
  {
    // 在这里定义模型属性
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
)
// db.sync()
module.exports = RegEmail
