import request from "@/utils/request"
import { reqMenuListType } from "@/api/user/type"
import { prefix } from "@/api/config"
enum API {
  menuList = "menuList",
}

export const reqMenuList = () =>
  request.get<any, reqMenuListType>(prefix.api + "/" + API.menuList)
