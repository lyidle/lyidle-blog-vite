/**
 * Request
 */
export interface SendUserMsgBody {
  content: string
  receiverId: number
  msgId: string
  [property: string]: any
}
