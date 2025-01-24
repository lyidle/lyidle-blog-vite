import type { NextFunction } from "express"
//在文件外部扩展不知道怎么弄
declare global {
  // 生成一个闭区间类型，包含 0 和 End
  /* 参考 https://www.bilibili.com/video/BV1VMUpY2Em8/?spm_id_from=333.1007.top_right_bar_window_history.content.click&vd_source=33ca2162656e3db43f749f13ce4ac028 */
  type NumberMax<
    End extends number,
    Result extends number[] = []
  > = Result["length"] extends End
    ? [...Result, End][number] // 当数组长度达到 End 时，返回包括 End 的数字
    : NumberMax<End, [...Result, Result["length"]]> // 否则继续递归，增加数组长度

  // 创建一个类型，保留 Start 到 End 之间的数字，排除小于 Start 的数字
  /* 提供思路 让ai完成的 */
  type NumberRange<Start extends number, End extends number> = Exclude<
    NumberMax<End>,
    NumberMax<Start>
  > extends never
    ? never // 如果排除后没有数字，返回 never
    : Exclude<NumberMax<End>, NumberMax<Start>> | Start // 排除小于 Start 的数字，并保留 Start

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
