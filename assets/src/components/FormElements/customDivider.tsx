import { Divider } from 'antd'
import React from 'react'
import { neutral } from '../../style/colors'

interface CustomDividerProps {
  text: string
  orientation?: DividerOrientation
}

export enum DividerOrientation {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export const CustomDivider = (p: CustomDividerProps) => {
  const orientation = p.orientation || DividerOrientation.LEFT
  return (
    <Divider
      dashed
      orientation={orientation}
      plain={false}
      style={{ borderColor: neutral.gray6, marginTop: '3px' }}
    >
      {p.text}
    </Divider>
  )
}
