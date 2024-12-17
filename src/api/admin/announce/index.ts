import request from "@/utils/request"
import { prefix } from "@/api/config"
enum API {
  announce = "/announce",
}

export const reqAnnounce = () =>
  request.get<any, any>(prefix.api + API.announce)
