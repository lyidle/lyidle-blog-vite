const apiPrefix = import.meta.env.VITE_API
import { menuListType } from "@/api/user/type"
export enum prefix {
  api = apiPrefix,
}
export interface apiReqType {
  status: number
  data: null | object
  message: string
}
