import { createClient } from "redis"
//创建全局的Redis客户端实例
let client: ReturnType<typeof createClient>
/*
 * 初始化Redis客户端
 */
export const redisClient = async () => {
  if (client) return //如果客户端已经初始化，则不再重复初始化
  client = await createClient()
    // await createClient({ password: "123456", name: "vite-blog" })
    .on("error", (err) => console.log("Redis 连接失败", err))
    .connect()
}
/*
 *存入数组或对象，并可选地设置过期时间
 *@param key 键名
 *@param value 要存储的值
 *@param ttl 可选，以秒为单位的过期时间，默认不设置
 */
export const setKey = async (
  key: string,
  value: any,
  ttl: number | null = null
) => {
  if (!client) await redisClient() //确保客户端已初始化
  value = JSON.stringify(value) //将对象转换为JSON字符串
  await client.set(key, value)
  //如果提供了ttl，则设置过期时间
  if (ttl !== null) {
    // await client.expire(key, ttl) //ttl 单位秒
    await client.pExpire(key, ttl) //ttl 单位毫秒
  }
  return value ? JSON.parse(value) : null //如果value为空，返回null而不是抛出错误
}

/*
 *读取数组或对象
 *@param key键名
 *@returns {Promise<any>} 解析后的JSoN对象或数组
 */
export const getKey = async (key: string) => {
  if (!client) await redisClient() //确保客户端已初始化
  const value = await client.get(key) //将获取到的JSoN字符串转换回对象
  return value ? JSON.parse(value) : null //如果value为空，返回null而不是抛出错误
}

/*
 *清除缓存数据
 *@param key
 *@returns {Promise<void>}
 */
export const delKey = async (key: string) => {
  if (!client) await redisClient() //确保客户端已初始化
  await client.del(key)
}
