export const set_local = (tokenName: string, token: string) => {
  localStorage.setItem(tokenName, token)
}
export const get_local = (tokenName: string) => {
  return localStorage.getItem(tokenName) as string
}
export const remove_local = (tokenName: string) => {
  localStorage.removeItem(tokenName)
}
