// 使用 AES算法加密
// @ts-ignore
import CryptoJS from "crypto-js"
import { crypt } from "./crypto-sha256"
const SECRET_KEY = import.meta.env.VITE_INITIAL_HASH
// 加密函数，返回加密后的字符串
export const aes_encrypt = (data: object): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString()
}

// 解密函数，返回解密后的对象
export const aes_decrypt = (data: string): object => {
  const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY)
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

interface StorageData {
  value: any
  expires?: number // 过期时间戳（毫秒）
}
/**
 * 设置 localStorage 持久化数据（带过期时间）
 * @param storeName - 存储名称
 * @param value - 要存储的值
 * @param ttl - 存活时间（毫秒），可选
 */
export const setPersistedData = (
  storeName: string,
  value: any,
  ttl?: number
): void => {
  try {
    // 生成加密后的 key
    const encryptedKey = crypt(storeName)

    // 准备存储的数据结构
    const data: StorageData = {
      value,
      expires: ttl ? Date.now() + ttl : undefined,
    }

    // 加密并存储
    localStorage.setItem(encryptedKey, aes_encrypt(data))
  } catch (error) {
    console.error("设置持久化数据失败:", error)
  }
}

/**
 * 获取存储在 localstorage 持久化中的数据
 * @param storeName - local store 名称
 * @param key - 原始 key（未加密）
 * @returns 对应的对象信息，如果不存在则返回 null
 */
export const getPersistedData = (
  storeName: string,
  key?: string | number
): any | null => {
  try {
    // 生成加密后的 key
    const encryptedKey = crypt(storeName)

    // 获取存储数据
    const rawData = localStorage.getItem(encryptedKey)

    if (!rawData) return null

    // 解析并解密数据
    const storeData = aes_decrypt(rawData) as Record<string, any>
    // 检查是否过期
    if (storeData.expires && Date.now() > storeData.expires) {
      localStorage.removeItem(encryptedKey)
      return null
    }

    // 自制的保存函数 的数据 会 保存到 value当中
    // pinia 的没有value
    const value = storeData?.value ? storeData.value : storeData
    // 有 key 返回全部 对应的对象信息
    if (key) return value[key] ?? null
    // 没有 key 返回全部 对象信息
    else return value ?? null
  } catch (error) {
    console.error("获取持久化数据失败:", error)
    return null
  }
}

/**
 * 移除 localstorage 持久化数据
 * @param storeName - local store 名称
 */
export const removePersistedData = (storeName: string): void => {
  try {
    // 生成加密后的 key
    const encryptedKey = crypt(storeName)
    // 移除整个store
    localStorage.removeItem(encryptedKey)
  } catch (error) {
    console.error("移除持久化数据失败:", error)
  }
}
