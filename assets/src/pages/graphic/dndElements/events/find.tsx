import React from 'react'

interface EventFindProps {
  name: string
}

export const EventFind = (p: EventFindProps) => <div>{p.name}</div>
