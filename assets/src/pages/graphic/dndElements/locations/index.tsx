import React from 'react'
import { StyledDndItem } from '..'
import { CategoriesColorEnum } from '../../library'

interface LocationItemProps {
  id: string
  name: string
}

export const LocationItem = (p: LocationItemProps) => {
  const a = 0
  return (
    <StyledDndItem color={CategoriesColorEnum.LOCATIONS} key={p.id}>
      {p.name}
    </StyledDndItem>
  )
}
