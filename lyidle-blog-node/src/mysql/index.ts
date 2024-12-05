import { DATABASE } from "@/config.json"
import { Sequelize } from "sequelize"
const { host, user, port, password, database } = DATABASE
//连接数据库
const db = new Sequelize(database, user, password, {
  host: host,
  port: parseInt(port),
  dialect: "mysql",
})
module.exports = db
