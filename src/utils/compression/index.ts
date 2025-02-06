// @ts-ignore
import pako from "pako"

// 将 Uint8Array 转为 Base64（Node.js 和浏览器通用）
const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
  // 使用 Buffer 在 Node.js 环境中处理 Base64
  if (typeof Buffer !== "undefined") {
    return Buffer.from(uint8Array).toString("base64")
  }
  // 浏览器环境处理
  return btoa(String.fromCharCode(...uint8Array))
}

// 将 Base64 转为 Uint8Array（Node.js 和浏览器通用）
const base64ToUint8Array = (base64: string): Uint8Array => {
  // 使用 Buffer 在 Node.js 环境中处理 Base64
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(base64, "base64"))
  }
  // 浏览器环境处理
  const binaryString = atob(base64)
  const len = binaryString.length
  const uint8Array = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    uint8Array[i] = binaryString.charCodeAt(i)
  }
  return uint8Array
}

// 压缩字符串
export const compressString = (input: string): string | undefined => {
  try {
    // 压缩为 Uint8Array，并直接转为 Base64
    return uint8ArrayToBase64(pako.deflate(input))
  } catch (err) {
    console.error("压缩失败：", err)
  }
}

// 解压字符串
export const decompressString = (compressed: string): string | undefined => {
  // 解压 Base64 -> Uint8Array -> 原始字符串
  return pako.inflate(base64ToUint8Array(compressed), { to: "string" })
}
