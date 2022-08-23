import React from 'react'
import { ControlsValuesEnum } from '../../library'
import { ControlRepeat } from './repeat'

export const SwitcherControls = (name: string, children: any[]) => {
  switch (name) {
    case ControlsValuesEnum.REPEAT:
      return <ControlRepeat name={name} />
    default:
      return <></>
  }
}
