import moment from "moment"
import "moment/dist/locale/zh-cn"
moment.locale("zh-cn")
export default (data: moment.MomentInput, format: string = "YYYY-MM-DD") => {
  return moment(new Date(data as string)).format(format)
}
