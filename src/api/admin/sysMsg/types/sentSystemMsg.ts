/**
 * Request
 */
export interface SentSystemMsg {
  content: string
  isAll: boolean
  title: string
  userId?: number | null
  [property: string]: any
}
