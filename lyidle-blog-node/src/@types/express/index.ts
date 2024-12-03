import type { Response, Request, NextFunction } from "express"
export type MyLocals = {
  result: (
    data: object,
    message: string
  ) => { status: string | number; data: object; message: string }
}
export type MyResponse = Response<any, MyLocals>
