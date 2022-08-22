import React from 'react'
import { StyledDndItem } from '..'
import { useIdRef } from '../../../../utils/useIdRef'
import { CategoriesColorEnum } from '../../library'

interface LocationItemProps {
  name: string
}

export const LocationItem = (p: LocationItemProps) => {
  const id = useIdRef(p.name)
  return (
    <StyledDndItem color={CategoriesColorEnum.LOCATIONS} key={id}>
      {p.name}
    </StyledDndItem>
  )
}
