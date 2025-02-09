// 默认 title
const VITE_INITIAL_TITLE = import.meta.env.VITE_INITIAL_TITLE

export const setTitle = (title: unknown) => {
  if (title) {
    document.title = title || VITE_INITIAL_TITLE
  }
}
