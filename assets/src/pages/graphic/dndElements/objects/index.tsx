import React from 'react'
import { StyledDndItem } from '..'
import { CategoriesColorEnum } from '../../library'

interface ObjectItemProps {
  id: string
  name: string
}

export const ObjectItem = (p: ObjectItemProps) => {
  const a = 0
  return (
    <StyledDndItem color={CategoriesColorEnum.OBJECTS} key={p.id}>
      {p.name}
    </StyledDndItem>
  )
}
