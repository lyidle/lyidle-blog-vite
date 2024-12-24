import moment from "moment"
export default (data: moment.MomentInput, format: string = "YYYY-MM-DD") => {
  return moment(new Date(data as string)).format(format)
}
