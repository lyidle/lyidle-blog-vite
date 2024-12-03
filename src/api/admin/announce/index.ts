import request from "@/utils/request"
import { prefix } from "@/api/config"
enum API {
  announce = "/admin/announce",
}

export const reqAnnounce = () =>
  request.get<any, any>(prefix.api + API.announce)
