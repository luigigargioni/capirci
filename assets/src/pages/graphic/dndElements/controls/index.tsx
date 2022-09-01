import React from 'react'
import { ControlInterface } from '..'
import { ControlsValuesEnum } from '../../library'
import { ControlLoop } from './loop'
import { ControlRepeat } from './repeat'
import { ControlWhen } from './when'

export const SwitcherControls = (item: ControlInterface, index: number) => {
  switch (item.name) {
    case ControlsValuesEnum.REPEAT:
      return (
        <ControlRepeat
          id={item.id}
          name={item.name}
          items={item.items}
          iteration={item.iteration}
          index={index}
        />
      )
    case ControlsValuesEnum.LOOP:
      return (
        <ControlLoop
          id={item.id}
          name={item.name}
          items={item.items}
          index={index}
        />
      )
    case ControlsValuesEnum.WHEN:
    case ControlsValuesEnum.STOP_WHEN:
    case ControlsValuesEnum.DO_WHEN:
      return (
        <ControlWhen
          id={item.id}
          name={item.name}
          event={item.event}
          items={item.items}
        />
      )
    default:
      return <></>
  }
}
