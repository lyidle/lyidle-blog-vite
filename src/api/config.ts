const apiPrefix = import.meta.env.VITE_API
export enum prefix {
  api = apiPrefix,
}
export interface apiReqType {
  status: number
  data: null | object
  message: string
}
