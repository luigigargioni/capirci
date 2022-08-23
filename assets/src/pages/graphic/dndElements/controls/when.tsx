import React from 'react'
import { ActionInterface, ControlInterface, EventInterface } from '..'

interface ControlWhenProps {
  id: string
  name: string
  event: EventInterface
  items: (ControlInterface | ActionInterface)[]
}

export const ControlWhen = (p: ControlWhenProps) => {
  const a = 0
  return <div>aaa</div>
}
