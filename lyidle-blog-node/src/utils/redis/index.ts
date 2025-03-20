import { createClient, RedisClientType } from "redis"
import dotenv from "dotenv"

dotenv.config() // 加载环境变量

const redis_prefix: string = process.env.redis_prefix || "" // Redis 保存键的前缀，默认为空
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
    password: redis_pwd || "",
    url: `redis://${redis_host || "127.0.0.1"}`,
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
 * 批量删除以指定前缀开头的 key，并根据 `patterns` 和自定义回调进行过滤
 *
 * @param prefix - **前缀(string)**（如 `"menu:"`），用于筛选以该前缀开头的 key
 * @param patterns - **匹配模式(string[])**（可选），如果提供，则仅删除匹配 `patterns` 的 key，否则删除所有匹配 `prefix` 的 key
 * @param options - **可选参数对象**
 * @param options.like - **模糊匹配(boolean)** 按照 `prefix`查询结果 `keys` 与 patterns 来进行模糊匹配 删除对应的缓存 和 callback 中的使用 的方法方法一致
 * @param options.unlike - **模糊匹配(boolean)** 按照 `prefix`查询结果 `keys` 与 patterns 来进行精确匹配 删除对应的缓存 和 callback 中的使用 的方法方法一致
 * @param options.callback - **自定义过滤回调(function)**，接收 `keys`（匹配前缀的所有 key）和 `patterns`（可选的匹配模式），应返回需要删除的 key 数组
 *
 * @returns **删除的 key 数量**
 *
 * @example
 * ```ts
 * const deletedCount = await delKeys("menu:", ["read", "write"], {
 *   模糊匹配
 *   callback: (keys, patterns) => keys.filter(key => patterns.some(delKey => key.includes(delKey)))
 *   精确匹配
 *   callback: (keys, patterns) => keys.filter((key) => patterns?.includes(key))
 * })
 * console.log(`删除了 ${deletedCount} 个键`)
 * ```
 */
const delKeys = async (
  prefix: string,
  patterns?: string[],
  options?: {
    callback?: (keys: string[], patterns?: string[]) => string[]
    like?: boolean
    unlike?: boolean
  }
): Promise<number> => {
  if (!client) await redisClient() // 确保客户端已初始化

  // 获取所有以 prefix 开头的 key 的回调函数
  const _getKeys = async () => await getKeys(prefix)

  // 默认 按照 传入 patterns 来进行删除
  // 或者 按照查询到的所有以 prefix 开头的 来进行删除
  let filteredKeys = patterns
  let keys: string[] = []
  if (!patterns) {
    // 获取所有以 prefix 开头的 key
    const _keys = await _getKeys()

    if (!_keys?.length) {
      console.log(prefix, "没有匹配的 key 需要删除")
      return 0
    }
    filteredKeys = _keys
    keys = _keys
  }

  // 有配置项
  if (options && patterns) {
    // 提取 对应的 配置项
    const { callback, like, unlike } = options

    let curKeys = keys.length && keys
    // 如果 没有 查找所有keys 则查找
    if (!curKeys) {
      const allkeys = await _getKeys()
      curKeys = allkeys
    }

    // 模糊 匹配
    if (like) {
      filteredKeys = curKeys.filter((key) =>
        patterns.some((delKey) => key.includes(delKey))
      )
    }
    // 全等 匹配
    if (unlike) {
      filteredKeys = curKeys.filter((key) => patterns?.includes(key))
    }

    // 如果有 callback，使用回调函数过滤 keys
    if (callback) {
      filteredKeys = callback(curKeys, patterns)
    }
  }

  if (!filteredKeys?.length) {
    console.log(filteredKeys, "过滤后没有匹配的 key 需要删除")
    return 0
  }

  // 拼接完整的 key（加上 redis_prefix）
  const fullKeys = filteredKeys.map((key) => `${redis_prefix}:${prefix}${key}`)
  // 使用 DEL 命令批量删除
  const deletedCount = await client!.del(fullKeys)
  console.log(`${prefix}删除了 ${deletedCount} 个 key`)

  return deletedCount
}

/**
 * 生成缓存 key
 * @param prefix 前缀（如 "menu:"）
 * @param items 字符串数组（如角色数组）
 * @returns 格式化后的缓存 key sort排序+join使用,分割
 */
const genCacheKey = (prefix: string, items: string[]): string => {
  if (!items || !items?.length) {
    throw new Error("items 不能为空")
  }

  // 对数组进行排序并用逗号分隔
  const sortedItems = items.sort().join(",")

  // 返回格式化后的缓存 key
  return `${prefix}${sortedItems}`
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

export {
  redisClient,
  setKey,
  getKey,
  delKey,
  clear,
  getKeys,
  delKeys,
  genCacheKey,
}
