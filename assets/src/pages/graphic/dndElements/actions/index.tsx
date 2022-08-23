import React from 'react'
import { StyledDndItem } from '..'
import { useIdRef } from '../../../../utils/useIdRef'
import { CategoriesColorEnum } from '../../library'

interface ActionItemProps {
  name: string
}

export const ActionItem = (p: ActionItemProps) => {
  const id = useIdRef(p.name)
  return (
    <StyledDndItem color={CategoriesColorEnum.OBJECTS} key={id}>
      {p.name}
    </StyledDndItem>
  )
}
