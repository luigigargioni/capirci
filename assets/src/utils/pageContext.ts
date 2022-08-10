export const getPageContext = <T = any>() => {
  const pageContext = document.getElementById('page-context')?.textContent
  if (!pageContext) return null
  return JSON.parse(pageContext) as T
}

export const clearPageContext = () => {
  document.getElementById('page-context').remove()
}
