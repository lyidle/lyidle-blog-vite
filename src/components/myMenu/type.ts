export type dataType = {
  id: string | number
  name: string
  to: string
  icon: string
}[]
export interface propsType {
  top?: string
  left?: string
  data: dataType
}
