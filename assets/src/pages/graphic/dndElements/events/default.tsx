import React from 'react'
import { StyledDndItem } from '..'
import { useIdRef } from '../../../../utils/useIdRef'
import { CategoriesColorEnum } from '../../library'

interface EventItemProps {
  name: string
}

export const EventItem = (p: EventItemProps) => {
  const id = useIdRef(p.name)
  return (
    <StyledDndItem color={CategoriesColorEnum.EVENTS} key={id}>
      {p.name}
    </StyledDndItem>
  )
}
