import express from "express"
import { myError } from "@/utils/Error"
const router = express.Router()

const { expressjwt } = require("express-jwt")

export const jwt = expressjwt({
  secret: process.env.HASH,
  algorithms: ["HS256"],
})

const adminData: string[] = JSON.parse(process.env.Admin as string)

export const admin = router.use((req, res, next) => {
  const userRole = JSON.stringify(req.auth.role)
  // 判断是否有权限
  if (!adminData.some((item) => item === userRole))
    next(new myError("PermissionError~"))
  next()
})
