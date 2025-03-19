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

/**
 * 获取存储在 Pinia 持久化中的数据
 * @param storeName - Pinia store 名称
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
    const rawData = localStorage.getItem(`${encryptedKey}`)

    if (!rawData) return null

    // 解析并解密数据
    const storeData = aes_decrypt(rawData) as Record<string, any>

    // 有 key 返回全部 对应的对象信息
    if (key) return storeData[key] ?? null
    // 没有 key 返回全部 对象信息
    else return storeData ?? null
  } catch (error) {
    console.error("获取持久化数据失败:", error)
    return null
  }
}
