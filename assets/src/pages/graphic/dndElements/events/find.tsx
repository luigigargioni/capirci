import React from 'react'
import { ObjectInterface } from '..'

interface EventFindProps {
  id: string
  name: string
  object: ObjectInterface
}

export const EventFind = (p: EventFindProps) => <div>{p.name}</div>
