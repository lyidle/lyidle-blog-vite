import axios from "axios"
enum API {
  one = "https://v1.jinrishici.com/tianqi",
}
export const getSentence = () => axios.get(API.one)
