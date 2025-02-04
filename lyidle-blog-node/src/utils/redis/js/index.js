const { createClient } = require("redis")
const dotenv = require("dotenv")

dotenv.config() // 加载环境变量

const is_production = JSON.parse(process.env.is_production || "false") // 是否为生产环境
const redis_pwd = process.env.redis_pwd // Redis 密码
const redis_host = process.env.redis_host // Redis 主机地址

// 全局 Redis 客户端实例
let client = null

/**
 * 初始化 Redis 客户端，如果已初始化则直接返回。
 */
const redisClient = async () => {
  if (client) return // 如果客户端已经初始化，则不再重复初始化
  client = createClient({
    password: is_production ? redis_pwd || "" : "",
    url: `redis://${is_production ? redis_host : "127.0.0.1"}`,
  })

  client.on("error", (err) => console.log("Redis 连接失败:", err)) // 监听连接错误
  await client.connect() // 连接 Redis
}

/**
 * 存入数组或对象，并可选地设置过期时间。
 * @param {string} key 键名
 * @param {any} value 要存储的值
 * @param {number | null} ttl 可选参数，以毫秒为单位的过期时间，默认不设置
 * @returns {Promise<any>} 存储的值
 */
const setKey = async (key, value, ttl = null) => {
  if (!client) await redisClient() // 确保客户端已初始化
  const serializedValue = JSON.stringify(value) // 将对象转换为 JSON 字符串
  await client.set(`vite-blog:${key}`, serializedValue)

  if (ttl !== null) {
    await client.pExpire(`vite-blog:${key}`, ttl) // 设置过期时间（毫秒）
  }

  return value // 返回存储的值
}

/**
 * 读取数组或对象。
 * @param {string} key 键名
 * @returns {Promise<any | null>} 解析后的 JSON 对象或数组
 */
const getKey = async (key) => {
  if (!client) await redisClient() // 确保客户端已初始化
  const value = await client.get(`vite-blog:${key}`)
  return value ? JSON.parse(value) : null // 如果值为空，返回 null
}

/**
 * 删除指定键的数据。
 * @param {string} key 键名
 * @returns {Promise<void>}
 */
const delKey = async (key) => {
  if (!client) await redisClient() // 确保客户端已初始化
  await client.del(`vite-blog:${key}`)
}

/**
 * 清空当前 Redis 数据库。
 * @returns {Promise<void>}
 */
const clear = async () => {
  try {
    if (!client) await redisClient() // 确保客户端已初始化
    const response = await client.sendCommand(["FLUSHDB"]) // 清空当前数据库
    console.log(`当前数据库已清空: ${response}`) // response 应为 "OK"
  } catch (error) {
    console.error(`清空数据库失败: ${error.message}`)
  }
}

module.exports = { redisClient, setKey, getKey, delKey, clear }
