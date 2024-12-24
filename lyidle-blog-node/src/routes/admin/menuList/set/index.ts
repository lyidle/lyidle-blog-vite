import express from "express"
// 引入jwt
import { jwt } from "@/middleware/auth"
// 引入管理权限判断
import { admin } from "@/middleware/auth"
// 引入模型
const { Menu, MenuList } = require("@/db/models")
const router = express.Router()
// 提取 layout
const extractLayout = (data: any, result: any) => {
  if (data) {
    const { width, left, top } = data
    const { layout } = result
    // 当result中没有时才改变
    if (width && !layout.width) result.layout.width = width
    if (left && !layout.left) result.layout.left = left
    if (top && !layout.top) result.layout.top = top
    return result
  } else return result
}
// 提取 bannerImg
const extractBannerImg = (data: any, result: any) => {
  if (data) {
    const { dark, light, height } = data
    const { bannerImg } = result
    // 当result中没有时才改变
    if (dark && !bannerImg.dark) result.bannerImg.dark = dark
    if (light && !bannerImg.light) result.bannerImg.light = light
    if (height && !bannerImg.height) result.bannerImg.height = height
    return result
  } else return result
}
// 设置菜单 增加和修改一体
router.put("/", jwt, admin, async (req, res, next) => {
  const data = req.body
  if (!(data instanceof Array)) return res.result(void 0, "设置菜单失败~")
  try {
    for (let i = 0; i < data.length; i++) {
      const menu = data[i]
      const { name, icon, to, children, layout, bannerImg } = menu
      let result: any = { name, icon, to, layout: {}, bannerImg: {} }
      // 处理 layout 和 bannerImg
      result = extractLayout(layout, result)
      result = extractBannerImg(bannerImg, result)
      const findMenu = await Menu.findOne({ where: { name } })
      let menuId = findMenu?.dataValues.id
      // 有无 菜单
      if (findMenu) {
        // 更新需要处理 layout、bannerImg 防止覆盖
        const { layout, bannerImg } = findMenu.dataValues
        result = extractLayout(layout, result)
        result = extractBannerImg(bannerImg, result)
        findMenu.update(result)
      } else {
        const data = await Menu.create(result)
        menuId = data.dataValues.id
      }
      // 有无 children
      if (children) {
        // 添加 children
        for (let i = 0; i < children.length; i++) {
          const item = children[i]
          const { name, to, icon, bannerImg } = item
          let result: any = { name, to, icon, menuId: menuId, bannerImg: {} }
          // 处理 bannerImg
          result = extractBannerImg(bannerImg, result)
          const findList = await MenuList.findOne({ where: { name } })
          // 有无 子项
          if (findList) {
            // 更新需要处理 bannerImg 防止覆盖
            const { bannerImg } = findList.dataValues
            result = extractBannerImg(bannerImg, result)
            await findList.update(result)
          } else {
            await MenuList.create(result)
          }
        }
      }
    }
    return res.result(void 0, "设置菜单成功~")
  } catch (error) {
    return res.validateAuth(error, next, () =>
      res.result(void 0, "设置菜单失败~")
    )
  }
})
export default router
