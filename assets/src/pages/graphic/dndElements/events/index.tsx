import React from 'react'
import { EventFind } from './find'
import { EventItem } from './default'
import { EventsValuesEnum } from '../../library'

export const SwitcherEvents = (name: string) => {
  switch (name) {
    case EventsValuesEnum.FIND:
      return <EventFind name={name} />
    case EventsValuesEnum.SENSOR_SIGNAL:
    case EventsValuesEnum.DETECT_OBJECT:
      return <EventItem name={name} />
    default:
      return <></>
  }
}
