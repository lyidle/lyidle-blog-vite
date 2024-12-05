import type { Response, Request, NextFunction } from "express"
export type MyLocals = {
  result: (
    //返回类型
    data: object,
    message: string
  ) => { status: string | number; data: object; message: string }
  db: any //数据库
}
export type MyResponse = Response<any, MyLocals>
