import React, { useState } from 'react'
import { Button, Checkbox, FormControlLabel, Stack } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import { DownloadOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'

import { MainCard } from 'components/MainCard'
import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { downloadPdf } from 'utils'
import { MessageText } from 'utils/messages'
import { formatDateBackend } from 'utils/date'

const RegistroCompilazione = () => {
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(
    dayjs().startOf('month')
  )
  const [dateTo, setDateTo] = useState<Dayjs | null>(
    dayjs().endOf('month')
  )
  const [test, setTest] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)

  const handleDownload = () => {
    if (!dateFrom || !dateTo) {
      toast.error(MessageText.requiredField)
      setError(true)
      return
    }
    if (dayjs(dateFrom).diff(dayjs(dateTo)) > 0) {
      toast.error(MessageText.invalidDate)
      setError(true)
      return
    }
    fetchApi({
      mod: endpoints.register.full.mod,
      fnz: endpoints.register.full.fnz,
      body: {
        date_from: formatDateBackend(dateFrom),
        date_to: formatDateBackend(dateTo),
        test,
      },
      methodApi: MethodHTTP.POST,
    }).then((res) => {
      if (res?.bool) {
        downloadPdf(res.data.b64, res.data.name)
        toast.success(MessageText.success)
        return
      }
      toast.error(MessageText.serverError)
    })
  }

  return (
    <MainCard title="Tabella piena">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 4 }}
      >
        <DatePicker
          label="Da"
          value={dateFrom}
          onChange={(newValue) => {
            setDateFrom(newValue)
            setError(false)
          }}
          slotProps={{ textField: { error } }}
        />
        <DatePicker
          label="A"
          value={dateTo}
          onChange={(newValue) => {
            setDateTo(newValue)
            setError(false)
          }}
          slotProps={{ textField: { error } }}
        />
        <FormControlLabel
          control={
            <Checkbox
              id="test"
              value={test}
              name="test"
              onChange={() => setTest(!test)}
              checked={test}
            />
          }
          label="Test"
        />
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={handleDownload}
          startIcon={<DownloadOutlined />}
        >
          Download
        </Button>
      </Stack>
    </MainCard>
  )
}

export default RegistroCompilazione
