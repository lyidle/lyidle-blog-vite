/**
 * 判断是否是一个url
 */
export const isUrlReg =
  /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(:[0-9]{1,5})?(\/[^\s?#]*)?(\?[^\s#]*)?(#[^\s]*)?$/

/**
 * 判断是否以 http: 或 https: 开头
 */
export const urlReg = /^https?:/

/**
 * 判断是否是一个url
 * @param url string
 * @returns boolean
 */
export const isUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
