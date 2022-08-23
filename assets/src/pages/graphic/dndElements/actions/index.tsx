import React from 'react'
import { ActionInterface, ObjectInterface, StyledDndItem } from '..'
import { CategoriesColorEnum } from '../../library'

interface ActionItemProps {
  id: string
  name: string
  object: ObjectInterface
}

export const ActionItem = (p: ActionItemProps) => {
  const a = 0
  return (
    <StyledDndItem color={CategoriesColorEnum.ACTIONS} key={p.id}>
      {p.name}
    </StyledDndItem>
  )
}
