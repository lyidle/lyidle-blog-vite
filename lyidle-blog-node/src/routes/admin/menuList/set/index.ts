import express from "express"
import { literal } from "sequelize"
// 设置redis 缓存
import { getKey, setKey } from "@/utils/redis"
const { Menu, MenuList } = require("@/db/models")
const router = express.Router()
router.get("/", async (req, res, next) => {})
export default router
