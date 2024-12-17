import moment from "moment"
moment.locale("zh-cn")
export default (date: Date, format: string) => {
  return moment(date).format(format)
}
