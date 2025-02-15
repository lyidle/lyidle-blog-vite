import { createClient, RedisClientType } from "redis"
import dotenv from "dotenv"

dotenv.config() // 加载环境变量

const redis_prefix: string = process.env.redis_prefix || "" // Redis 保存键的前缀，默认为空
const is_production: boolean = JSON.parse(process.env.is_production || "false") // 是否为生产环境
const redis_pwd: string | undefined = process.env.redis_pwd // Redis 密码
const redis_host: string | undefined = process.env.redis_host // Redis 主机地址

// 定义 Redis 客户端类型
type RedisClientInstance = RedisClientType | null

// 全局 Redis 客户端实例
let client: RedisClientInstance = null

/**
 * 初始化 Redis 客户端，如果已初始化则直接返回。
 */
const redisClient = async (): Promise<void> => {
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
 * @param key 键名
 * @param value 要存储的值
 * @param ttl 可选参数，以毫秒为单位的过期时间，默认不设置
 * @returns 存储的值
 */
const setKey = async (
  key: string,
  value: any,
  ttl: number | null = null
): Promise<any> => {
  if (!client) await redisClient() // 确保客户端已初始化
  const serializedValue = JSON.stringify(value) // 将对象转换为 JSON 字符串
  await client!.set(`${redis_prefix}:${key}`, serializedValue)

  if (ttl !== null) {
    await client!.pExpire(`${redis_prefix}:${key}`, ttl) // 设置过期时间（毫秒）
  }

  return value // 返回存储的值
}

/**
 * 读取数组或对象。
 * @param key 键名
 * @returns 解析后的 JSON 对象或数组
 */
const getKey = async (key: string): Promise<any | null> => {
  if (!client) await redisClient() // 确保客户端已初始化
  const value = await client!.get(`${redis_prefix}:${key}`)
  return value ? JSON.parse(value) : null // 如果值为空，返回 null
}

/**
 * 删除指定键的数据。
 * @param key 键名
 * @returns {Promise<void>}
 */
const delKey = async (key: string): Promise<void> => {
  if (!client) await redisClient() // 确保客户端已初始化
  await client!.del(`${redis_prefix}:${key}`)
}

/**
 * 批量删除以指定前缀开头的 key，并根据 patterns 和自定义回调过滤
 * @param prefix 前缀字符串（如 "menu:"）
 * @param patterns 需要匹配的数组项  如果没有 callback，使用默认的 patterns 过滤逻辑 将 patterns 拼接成逗号分隔的字符串 进行判断包含的删除
 * @param callback 自定义过滤回调函数
 * @returns 删除的 key 数量
 */
const delKeys = async (
  prefix: string,
  patterns?: string[],
  callback?: (keys: string[], patterns?: string[]) => string[]
): Promise<number> => {
  if (!client) await redisClient() // 确保客户端已初始化

  // 获取所有以 prefix 开头的 key
  const keys = await getKeys(prefix)

  if (keys.length === 0) {
    console.log(prefix, "没有匹配的 key 需要删除")
    return 0
  }

  // 如果有 callback，使用回调函数过滤 keys
  let filteredKeys = keys
  if (callback) {
    filteredKeys = callback(keys, patterns)
  } else if (patterns && patterns.length) {
    // 如果没有 callback，使用默认的 patterns 过滤逻辑
    const patternsString = patterns.join(",") // 将 patterns 拼接成逗号分隔的字符串
    filteredKeys = keys.filter((key) => key.includes(patternsString))
  }

  if (filteredKeys.length === 0) {
    console.log(filteredKeys, "过滤后没有匹配的 key 需要删除")
    return 0
  }

  // 拼接完整的 key（加上 redis_prefix）
  const fullKeys = filteredKeys.map((key) => `${redis_prefix}:${prefix}${key}`)

  // 使用 DEL 命令批量删除
  const deletedCount = await client!.del(fullKeys)
  console.log(`删除了 ${deletedCount} 个 key`)

  return deletedCount
}
/**
 * 清空当前 Redis 数据库。
 * @returns {Promise<void>}
 */
const clear = async (): Promise<void> => {
  try {
    if (!client) await redisClient() // 确保客户端已初始化
    const response = await client!.sendCommand(["FLUSHDB"]) // 清空当前数据库
    console.log(`当前数据库已清空: ${response}`) // response 应为 "OK"
  } catch (error: any) {
    console.error(`清空数据库失败: ${error.message}`)
  }
}

/**
 * 获取以指定前缀开头的所有 key，并去掉 redis_prefix 部分
 * @param prefix 前缀字符串（如 "menu:"）
 * @returns 去掉 redis_prefix 的 key 数组
 */
const getKeys = async (prefix: string): Promise<string[]> => {
  if (!client) await redisClient() // 确保客户端已初始化

  const pattern = `${redis_prefix}:${prefix}*` // 匹配前缀的 pattern
  const keys: string[] = []
  let cursor = 0 // 游标，用于分批次扫描

  do {
    // 使用 SCAN 命令遍历匹配的 key
    const reply = await client!.scan(cursor, {
      MATCH: pattern,
      COUNT: 100, // 每次扫描的 key 数量
    })

    cursor = reply.cursor // 更新游标
    keys.push(...reply.keys) // 将匹配的 key 加入数组
  } while (cursor !== 0) // 当游标为 0 时，表示扫描完成

  // 去掉 redis_prefix 部分
  const prefixToRemove = `${redis_prefix}:${prefix}`
  return keys.map((key) => key.slice(prefixToRemove.length))
}

export { redisClient, setKey, getKey, delKey, clear, getKeys, delKeys }
