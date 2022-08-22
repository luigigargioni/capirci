import React from 'react'
import { StyledDndItem } from '..'
import { useIdRef } from '../../../../utils/useIdRef'
import { CategoriesColorEnum } from '../../library'

interface ObjectItemProps {
  name: string
}

export const ObjectItem = (p: ObjectItemProps) => {
  const id = useIdRef(p.name)
  return (
    <StyledDndItem color={CategoriesColorEnum.OBJECTS} key={id}>
      {p.name}
    </StyledDndItem>
  )
}
