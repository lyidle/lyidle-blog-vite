import type { NextFunction } from "express"
//在文件外部扩展不知道怎么弄
declare global {
  namespace Express {
    interface Request {
      auth: {
        id: number | string
        account: string
        nickName: string
        avater?: string | null
        signer?: string | null
        email: string
        role: string
        iat?: Date
        exp?: Date
      }
    }
    interface Response {
      result: (
        data: any,
        message: string | string[],
        isBin?: boolean,
        resultCode?: number
      ) => void
      validateAuth: (err: any, next: NextFunction, cb: Function) => void
    }
  }
}
