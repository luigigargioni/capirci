import { InputNumber } from 'antd'
import React, { ChangeEvent, useState } from 'react'
import styled from 'styled-components'
import { ActionInterface, ControlInterface } from '..'
import { CategoriesColorEnum } from '../../library'

interface ControlRepeatProps {
  id: string
  name: string
  items: (ControlInterface | ActionInterface)[]
  iteration: number
}

export const ControlRepeat = (p: ControlRepeatProps) => {
  const [iteration, setIteration] = useState(p.iteration)

  const onChangeIteration = (value: number) => {
    // TODO - update iteration in JSON
    setIteration(value)
  }
  return (
    <WrapperControlRepeat key={p.id} color={CategoriesColorEnum.CONTROLS}>
      {p.name}
      <InputNumber
        value={iteration}
        onChange={onChangeIteration}
        min={1}
        size="small"
      />
    </WrapperControlRepeat>
  )
}

type WrapperControlRepeatProps = {
  readonly color: CategoriesColorEnum
}

const WrapperControlRepeat = styled.div<WrapperControlRepeatProps>`
  background-color: ${(p) => p.color};
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  border: 1px solid white;
  border-radius: 10px;
  height: 100%;
  width: 100%;
  padding: 20px;
  & > .ant-input-number {
    margin-left: 10px;
  }
`
