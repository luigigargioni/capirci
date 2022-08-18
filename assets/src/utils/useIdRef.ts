import { nanoid } from 'nanoid'
import { useRef } from 'react'

export const useIdRef = (componentName: string) => {
  const id = useRef(`${componentName}_${nanoid}`)
  return id.current
}
