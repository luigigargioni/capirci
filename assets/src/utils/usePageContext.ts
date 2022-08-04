import { useEffect, useState } from 'react'

export const usePageContext = <T = any>() => {
  const [pageContext, setPageContext] = useState<T | undefined>(undefined)
  useEffect(() => {
    const pageContext = document.getElementById('page-context').textContent
    setPageContext(JSON.parse(pageContext))
  }, [])
  return pageContext as T
}
