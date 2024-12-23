// 使用 SHA256算法加密
// @ts-ignore
import CryptoJS from "crypto-js"
const test = import.meta.env.VITE_INITIAL_HASH
export const crypt = (id: number | string) =>
  `${CryptoJS.SHA256(id + test).toString(CryptoJS.enc.Hex)}`
