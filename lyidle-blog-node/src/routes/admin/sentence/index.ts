import express from "express"
import poetry from "./poetry"
const router = express.Router()
router.use("/poetry", poetry)
export default router
