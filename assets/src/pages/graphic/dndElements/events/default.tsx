import React from 'react'
import { StyledDndItem } from '..'
import { CategoriesColorEnum } from '../../library'

interface EventItemProps {
  id: string
  name: string
}

export const EventItem = (p: EventItemProps) => {
  const a = 0
  return (
    <StyledDndItem color={CategoriesColorEnum.EVENTS} key={p.id}>
      {p.name}
    </StyledDndItem>
  )
}
