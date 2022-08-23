import React from 'react'
import styled from 'styled-components'
import { ActionInterface, ControlInterface } from '..'
import { CategoriesColorEnum } from '../../library'

interface ControlLoopProps {
  id: string
  name: string
  items: (ControlInterface | ActionInterface)[]
}

export const ControlLoop = (p: ControlLoopProps) => {
  const a = 0
  return (
    <WrapperControlLoop color={CategoriesColorEnum.CONTROLS}>
      aaa
    </WrapperControlLoop>
  )
}

type WrapperControlLoopProps = {
  readonly color: CategoriesColorEnum
}

const WrapperControlLoop = styled.div<WrapperControlLoopProps>`
  background-color: ${(p) => p.color};
  border-radius: 10px;
  height: 50px;
  width: 50px;
`
