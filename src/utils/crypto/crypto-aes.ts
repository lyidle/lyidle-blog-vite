// 使用 AES算法加密
// @ts-ignore
import CryptoJS from "crypto-js"
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
