export const isUrl = (url: string) => {
  const regex =
    /^(https?:\/\/)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(:[0-9]{1,5})?(\/.*)?$/
  return regex.test(url)
}
