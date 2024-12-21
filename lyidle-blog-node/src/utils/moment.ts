import moment from "moment"
moment.locale("zh-cn")
const myMoment = (date: Date, format: string) => {
  return moment(date).format(format)
}
export default myMoment
