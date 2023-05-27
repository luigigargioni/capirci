import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from '@mui/material'
import { DownloadOutlined } from '@ant-design/icons'
import { toast } from 'react-toastify'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { fetchApi, MethodHTTP } from 'services/api'
import { MessageText } from 'utils/messages'
import { downloadPdf } from 'utils'

const RegistroNeutro = () => {
  const [test, setTest] = useState<boolean>(true)
  const [pagesToPrint, setPagesToPrint] = useState<number>(1)

  const handleDownload = () => {
    fetchApi({
      mod: endpoints.register.empty.mod,
      fnz: endpoints.register.empty.fnz,
      body: {
        test,
        pagesToPrint,
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
    <MainCard title="Tabella vuota">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 2, sm: 2, md: 4 }}
      >
        <TextField
          id="pagesToPrint"
          value={pagesToPrint}
          name="pagesToPrint"
          label="Pagine"
          type="number"
          onChange={(value) => setPagesToPrint(Number(value.target.value))}
          inputProps={{ min: 1, max: 99 }}
          sx={{ width: 100 }}
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

export default RegistroNeutro
