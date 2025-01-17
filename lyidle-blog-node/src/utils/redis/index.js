const { createClient } = require("redis")
// 导入环境变量
require("dotenv").config()
const is_production = JSON.parse(process.env.is_production)
const redis_pwd = process.env.redis_pwd
const redis_host = process.env.redis_host
//创建全局的Redis客户端实例
let client
/*
 * 初始化Redis客户端
 */
const redisClient = async () => {
  if (client) return //如果客户端已经初始化，则不再重复初始化
  client = await createClient({
    password: is_production ? redis_pwd || "" : "",
    host: is_production ? redis_host : "127.0.0.1",
  })
    .on("error", (err) => console.log("Redis 连接失败", err))
    .connect()
}
/*
 *存入数组或对象，并可选地设置过期时间
 *@param key 键名
 *@param value 要存储的值
 *@param ttl 可选，以秒为单位的过期时间，默认不设置
 */
const setKey = async (key, value, ttl = null) => {
  if (!client) await redisClient() //确保客户端已初始化
  value = JSON.stringify(value) //将对象转换为JSON字符串
  await client.set(`vite-blog:${key}`, value)
  //如果提供了ttl，则设置过期时间
  if (ttl !== null) {
    // await client.expire(`vite-blog:${key}`, ttl) //ttl 单位秒
    await client.pExpire(`vite-blog:${key}`, ttl) //ttl 单位毫秒
  }
  return value ? JSON.parse(value) : null //如果value为空，返回null而不是抛出错误
}

/*
 *读取数组或对象
 *@param key键名
 *@returns {Promise<any>} 解析后的JSoN对象或数组
 */
const getKey = async (key) => {
  if (!client) await redisClient() //确保客户端已初始化
  const value = await client.get(`vite-blog:${key}`) //将获取到的JSoN字符串转换回对象
  return value ? JSON.parse(value) : null //如果value为空，返回null而不是抛出错误
}

/*
 *清除缓存数据
 *@param key
 *@returns {Promise<void>}
 */
const delKey = async (key) => {
  if (!client) await redisClient() //确保客户端已初始化
  await client.del(`vite-blog:${key}`)
}

/**
 * 清空当前 Redis 数据库
 * @returns {Promise<void>}
 */
const clear = async () => {
  try {
    if (!client) await redisClient() // 确保客户端已初始化

    const response = await client.sendCommand(["FLUSHDB"])
    console.log(`当前数据库已清空: ${response}`) // response 应为 "OK"
  } catch (error) {
    console.error(`清空数据库失败: ${error.message}`)
  }
}

module.exports = { redisClient, setKey, getKey, delKey, clear }
