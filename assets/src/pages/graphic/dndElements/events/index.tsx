import React from 'react'
import { EventFind } from './find'
import { EventItem } from './default'
import { EventsValuesEnum } from '../../library'
import { EventInterface } from '..'

export const SwitcherEvents = (item: EventInterface) => {
  switch (item.name) {
    case EventsValuesEnum.FIND:
      return <EventFind id={item.id} name={item.name} object={item.object} />
    case EventsValuesEnum.SENSOR_SIGNAL:
    case EventsValuesEnum.DETECT_OBJECT:
      return <EventItem id={item.id} name={item.name} />
    default:
      return <></>
  }
}
