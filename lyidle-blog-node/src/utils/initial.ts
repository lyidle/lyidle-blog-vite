// 引入redis 设置缓存
const { setKey, getKey } = require("@/utils/redis")
export default async () => {
  // 初始化创站时间
  const webCreatedAt = await getKey("webCreatedAt")
  if (!webCreatedAt) await setKey("webCreatedAt", new Date())
  // 初始化用户数
  const userCounts = await getKey("userCounts")
  if (!userCounts) {
    // 初始化一个管理员账户 默认 账号:admin，密码：123456
    await setKey("userCounts", 1)
  }
}
