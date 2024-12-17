import express from "express"
import jwt from "@/middleware/auth"
const router = express.Router()
router.get("/test", jwt, (req, res) => {
  console.log(req.auth)
  res.send("admin send")
})
export default router
