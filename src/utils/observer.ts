export interface returned {
  observer: IntersectionObserver | null
  entries: IntersectionObserverEntry[] | null
}
export const observer = (
  element: Element,
  enter?: Function,
  leave?: Function
): returned | undefined => {
  const result: returned = { observer: null, entries: null }
  const observer = new IntersectionObserver(($entries) => {
    result.entries = $entries
    if ($entries[0].intersectionRatio <= 0) {
      leave && leave()
      return
    }
    enter && enter()
  })
  if (element instanceof Element) observer.observe(element)
  result.observer = observer
  return result
}
