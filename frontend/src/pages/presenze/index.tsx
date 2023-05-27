import React from 'react'
import { MainCard } from 'components/MainCard'
import useSWR from 'swr'
import { endpoints } from 'services/endpoints'
import { CircularProgress } from '@mui/material'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { DatesSetArg } from '@fullcalendar/core'

import dayjs, { Dayjs } from 'dayjs'
import { formatDateBackend } from 'utils/date'
import { PresenzeType } from './types'

const Presenze = () => {
  const [startDate, setStartDate] = React.useState<Dayjs>(
    dayjs().startOf('month')
  )
  const [endDate, setEndDate] = React.useState<Dayjs>(dayjs().endOf('month'))
  const [calendarDate, setCalendarDate] = React.useState<Dayjs>(dayjs())

  const { data, isLoading } = useSWR<PresenzeType, Error>({
    mod: endpoints.reservation.list_calendar.mod,
    fnz: endpoints.reservation.list_calendar.fnz,
    body: {
      start: formatDateBackend(startDate),
      end: formatDateBackend(endDate),
    },
  })

  const handleDatesSet = (info: DatesSetArg) => {
    const nextStartDate = dayjs(info.startStr).add(1, 'month').startOf('month')
    const nextEndDate = dayjs(info.endStr).subtract(1, 'month').endOf('month')

    if (startDate.isSame(nextStartDate) && endDate.isSame(nextEndDate)) {
      return
    }
    setCalendarDate(nextStartDate)
    setStartDate(dayjs(info.startStr).add(1, 'month').startOf('month'))
    setEndDate(dayjs(info.endStr).subtract(1, 'month').endOf('month'))
  }

  const calendarOptions = {
    plugins: [dayGridPlugin],
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: '',
    },
    initialView: 'dayGridMonth',
    initialDate: calendarDate.format('YYYY-MM-DD'),
    locale: 'it',
    displayEventTime: false,
    datesSet: handleDatesSet,
  }

  return (
    <>
      {isLoading && <CircularProgress />}
      {data && (
        <>
          <MainCard title="Presenze mattina">
            <FullCalendar {...calendarOptions} events={data.morning} />
          </MainCard>
          <MainCard title="Presenze sera" sx={{ marginTop: '1rem' }}>
            <FullCalendar {...calendarOptions} events={data.evening} />
          </MainCard>
        </>
      )}
    </>
  )
}

export default Presenze
