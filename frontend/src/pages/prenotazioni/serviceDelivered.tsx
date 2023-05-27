import React from 'react'
import { Button, Grid, InputAdornment, Stack, TextField } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import { Popconfirm } from 'antd'
import dayjs from 'dayjs'
import { iconMap } from 'utils/iconMap'
import { MethodHTTP, fetchApi } from 'services/api'
import { MessageText } from 'utils/messages'
import { endpoints } from 'services/endpoints'
import { toast } from 'react-toastify'
import { ServiceDeliveredListType } from 'pages/servizi/types'

interface ServiceDeliveredProps {
  service: ServiceDeliveredListType
  servicesDeliveredState?: ServiceDeliveredListType[]
  setServicesDeliveredState?: (services: ServiceDeliveredListType[]) => void
  mutate?: () => void
}

export const ServiceDelivered = ({
  service,
  servicesDeliveredState,
  setServicesDeliveredState,
  mutate,
}: ServiceDeliveredProps) => {
  const handleDelete = () => {
    fetchApi({
      mod: endpoints.services.deleteDelivered.mod,
      fnz: endpoints.services.deleteDelivered.fnz,
      body: { id: service.id },
      methodApi: MethodHTTP.POST,
    }).then((res) => {
      if (res?.bool) {
        toast.success(MessageText.success)
        if (setServicesDeliveredState && servicesDeliveredState) {
          setServicesDeliveredState(
            servicesDeliveredState.filter((item) => item.id !== service.id)
          )
        }
        if (mutate) mutate()
        return
      }
      toast.error(MessageText.serverError)
    })
  }

  return (
    <>
      <Grid item xs={1}>
        <Stack spacing={1}>
          <Popconfirm
            title="Eliminare?"
            onConfirm={() => handleDelete()}
            okText="Ok"
            cancelText="Annulla"
            icon={iconMap.deleteCircle}
          >
            <Button
              color="error"
              aria-label="delete-service"
              size="small"
              title="Elimina"
              startIcon={iconMap.deleteTrash}
            />
          </Popconfirm>
        </Stack>
      </Grid>
      <Grid item xs={2}>
        <Stack spacing={1}>
          <TextField
            id="service_name"
            disabled
            value={service.service_name || ''}
            name="service_name"
            label="Servizio"
          />
        </Stack>
      </Grid>
      <Grid item xs={2}>
        <Stack spacing={1}>
          <TextField
            id="pet_name"
            disabled
            value={service.pet_name || ''}
            name="pet_name"
            label="Animale"
          />
        </Stack>
      </Grid>
      <Grid item xs={1}>
        <Stack spacing={1}>
          <TextField
            id="price"
            disabled
            value={service.price || 0}
            name="price"
            label="Prezzo"
            type="number"
            inputProps={{ min: -200, max: 200, step: 1, prefix: '€' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">€</InputAdornment>
              ),
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={2}>
        <Stack spacing={1}>
          <DateTimePicker
            value={dayjs(service.date_add)}
            label="Data"
            disabled
            slotProps={{
              textField: {
                id: 'payment_date',
                name: 'payment_date',
              },
            }}
          />
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Stack spacing={1}>
          <TextField
            id="note"
            disabled
            value={service.note || ''}
            name="note"
            label="Note"
          />
        </Stack>
      </Grid>
    </>
  )
}

ServiceDelivered.defaultProps = {
  servicesDeliveredState: [],
  setServicesDeliveredState: null,
  mutate: null,
}
