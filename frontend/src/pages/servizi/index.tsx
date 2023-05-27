import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { MainCard } from 'components/MainCard'
import React, { Fragment, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { endpoints } from 'services/endpoints'
import { backgroundForm } from 'themes/theme'
import useSWR from 'swr'
import { ServiceDelivered } from 'pages/prenotazioni/serviceDelivered'
import {
  DettaglioPrenotazioneType,
  GroomingServicesType,
  PrenotazioniListType,
} from 'pages/prenotazioni/types'
import { formatDateFrontend } from 'utils/date'
import { MethodHTTP, fetchApi } from 'services/api'
import { toast } from 'react-toastify'
import { MessageText } from 'utils/messages'
import { getFromLocalStorage, LocalStorageKey } from 'utils/localStorageUtils'
import { CloseOutlined } from '@ant-design/icons'
import { ServiceDeliveredListType } from './types'

const Servizi = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()

  const [selectedReservationId, setSelectedReservationId] =
    React.useState<string>(id || '')
  const [selectedPetId, setSelectedPetId] = React.useState<string>(
    searchParams.get('petId') || ''
  )
  const [selectedPetType, setSelectedPetType] = React.useState<string>(
    searchParams.get('petType') || ''
  )
  const [selectedServiceId, setSelectedServiceId] = React.useState<string>(
    searchParams.get('isGrooming') === '1'
      ? searchParams.get('serviceId') || ''
      : ''
  )
  const [selectedOtherServiceId, setSelectedOtherServiceId] =
    React.useState<string>(
      searchParams.get('isGrooming') === '0'
        ? searchParams.get('serviceId') || ''
        : ''
    )
  const [servicePrice, setServicePrice] = React.useState<number>(0)
  const [serviceNote, setServiceNote] = React.useState<string>('')

  const { data: reservationsListData, isLoading: reservationsListLoading } =
    useSWR<{ records: PrenotazioniListType[]; total: number }, Error>({
      mod: endpoints.reservation.list.mod,
      fnz: endpoints.reservation.list.fnz,
      body: {
        to_checkin: 0,
        to_checkout: 1,
        history: 0,
      },
    })

  const { data: prenotazioneData, isLoading: prenotazioneIsLoading } = useSWR<
    DettaglioPrenotazioneType,
    Error
  >(
    selectedReservationId
      ? {
          mod: endpoints.reservation.get.mod,
          fnz: endpoints.reservation.get.fnz,
          body: {
            id: selectedReservationId,
          },
        }
      : null
  )

  useEffect(() => {
    if (prenotazioneData?.pets.length === 1) {
      setSelectedPetId(prenotazioneData?.pets[0].id.toString())
      setSelectedPetType(prenotazioneData?.pets[0].type)
    }
  }, [prenotazioneData])

  const {
    data: servicesDeliveredData,
    isLoading: servicesDeliveredIsLoading,
    mutate,
  } = useSWR<{ cnt: number; records: ServiceDeliveredListType[] }, Error>(
    selectedReservationId
      ? {
          mod: endpoints.services.listDelivered.mod,
          fnz: endpoints.services.listDelivered.fnz,
          body: {
            reservation_id: selectedReservationId,
          },
        }
      : null
  )

  const { data: groomingData, isLoading: groomingIsLoading } = useSWR<
    { cnt: number; records: GroomingServicesType[] },
    Error
  >({
    mod: endpoints.services.list.grooming.mod,
    fnz: endpoints.services.list.grooming.fnz,
    body: {
      type: endpoints.services.list.grooming.type,
      deliverable: 1,
    },
  })

  const { data: otherData, isLoading: otherIsLoading } = useSWR<
    { cnt: number; records: any[] },
    Error
  >({
    mod: endpoints.services.list.other.mod,
    fnz: endpoints.services.list.other.fnz,
    body: {
      type: endpoints.services.list.other.type,
    },
  })

  useEffect(() => {
    if (otherData && searchParams.get('isGrooming') === '0') {
      const defaultServicePrice = otherData?.records.find(
        (service) => service.id.toString() === selectedOtherServiceId.toString()
      )?.price
      setServicePrice(defaultServicePrice)
    }
  }, [otherData])

  const handleAddService = () => {
    fetchApi({
      mod: endpoints.services.addDelivered.mod,
      fnz: endpoints.services.addDelivered.fnz,
      body: {
        reservation_id: selectedReservationId,
        pet_id: selectedPetId,
        user_id: getFromLocalStorage(LocalStorageKey.USER).id,
        grooming_service_id: selectedServiceId,
        other_service_id: selectedOtherServiceId,
        price: servicePrice,
        note: serviceNote,
      },
      methodApi: MethodHTTP.POST,
    }).then((res) => {
      if (res?.bool) {
        toast.success(MessageText.success)
        setSelectedServiceId('')
        setSelectedOtherServiceId('')
        setServiceNote('')
        setServicePrice(0)
        mutate()
        return
      }
      toast.error(MessageText.serverError)
    })
  }

  return (
    <>
      <MainCard title="Aggiunta servizi" sx={{ background: backgroundForm }}>
        {reservationsListLoading && <CircularProgress />}
        {!reservationsListLoading && (
          <Grid container spacing={3} columns={{ xs: 1, sm: 6, md: 12 }}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel id="reservation-label">Prenotazione</InputLabel>
                <Select
                  labelId="reservation-label"
                  id="reservation"
                  value={
                    reservationsListData?.records
                      ? selectedReservationId || ''
                      : ''
                  }
                  label="Prenotazione"
                  name="reservation"
                  onChange={(e) => {
                    setSelectedReservationId(e.target.value)
                    setSelectedPetId('')
                    setSelectedPetType('')
                    setSelectedServiceId('')
                    setSelectedOtherServiceId('')
                  }}
                >
                  {reservationsListData?.records.map((reservation) => (
                    <MenuItem value={reservation.id} key={reservation.id}>
                      {`${reservation.first_name} ${
                        reservation.last_name
                      } ${formatDateFrontend(
                        reservation.date_from
                      )} - ${formatDateFrontend(reservation.date_to)}`}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
            </Grid>
            {prenotazioneIsLoading && <CircularProgress />}
            {!prenotazioneIsLoading && (
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel id="pet-label">Animale</InputLabel>
                  <Select
                    labelId="pet-label"
                    id="pet"
                    value={prenotazioneData?.pets ? selectedPetId || '' : ''}
                    label="Animale"
                    name="pet"
                    disabled={!selectedReservationId}
                    onChange={(e) => {
                      setSelectedPetId(e.target.value)
                      setSelectedPetType(
                        prenotazioneData?.pets.find(
                          (pet) =>
                            pet.id.toString() === e.target.value.toString()
                        )?.type || ''
                      )
                      setSelectedServiceId('')
                      setSelectedOtherServiceId('')
                    }}
                  >
                    {prenotazioneData?.pets.map((pet) => (
                      <MenuItem value={pet.id} key={pet.id}>
                        {`${pet.name}: ${pet.type} (${pet.breed})`}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Grid>
            )}
            {groomingIsLoading && <CircularProgress />}
            {!groomingIsLoading && (
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel id="service-label">Servizio</InputLabel>
                  <Select
                    labelId="service-label"
                    id="service"
                    value={groomingData?.records ? selectedServiceId || '' : ''}
                    label="Servizio toelettatura"
                    name="service"
                    disabled={
                      !selectedPetId ||
                      !selectedPetType ||
                      !!selectedOtherServiceId
                    }
                    onChange={(e) => {
                      setSelectedServiceId(e.target.value)
                      setSelectedOtherServiceId('')
                      setServicePrice(0)
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          sx={{
                            display: selectedServiceId ? '' : 'none',
                            marginRight: '0.8rem',
                          }}
                          onClick={() => setSelectedServiceId('')}
                        >
                          <CloseOutlined />
                        </IconButton>
                      </InputAdornment>
                    }
                  >
                    {groomingData?.records
                      .filter((service) => {
                        if (selectedPetType === 'cane') {
                          return service.class.includes('dog')
                        }
                        if (selectedPetType === 'gatto') {
                          return service.class.includes('cat')
                        }
                        return false
                      })
                      .sort((a, b) => a.id - b.id)
                      .map((service) => (
                        <MenuItem value={service.id} key={service.id}>
                          {service.label}
                        </MenuItem>
                      ))}
                  </Select>
                </Stack>
              </Grid>
            )}
            {otherIsLoading && <CircularProgress />}
            {!otherIsLoading && (
              <Grid item xs={6}>
                <Stack spacing={1}>
                  <InputLabel id="other-service-label">
                    Altro servizio
                  </InputLabel>
                  <Select
                    labelId="other-service-label"
                    id="other_service"
                    value={
                      otherData?.records ? selectedOtherServiceId || '' : ''
                    }
                    label="Altro servizio"
                    name="other_service"
                    disabled={
                      !selectedPetId || !selectedPetType || !!selectedServiceId
                    }
                    onChange={(e) => {
                      setSelectedOtherServiceId(e.target.value)
                      setSelectedServiceId('')
                      setServicePrice(
                        otherData?.records.find(
                          (service) =>
                            service.id.toString() === e.target.value.toString()
                        )?.price || 0
                      )
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          sx={{
                            display: selectedOtherServiceId ? '' : 'none',
                            marginRight: '0.8rem',
                          }}
                          onClick={() => {
                            setSelectedOtherServiceId('')
                            setServicePrice(0)
                          }}
                        >
                          <CloseOutlined />
                        </IconButton>
                      </InputAdornment>
                    }
                  >
                    {otherData?.records.map((service) => (
                      <MenuItem value={service.id} key={service.id}>
                        {service.label}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Grid>
            )}
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="service_price"
                  disabled={
                    !selectedPetId ||
                    !selectedReservationId ||
                    (!selectedServiceId && !selectedOtherServiceId)
                  }
                  value={servicePrice || 0}
                  name="service_price"
                  label="Prezzo"
                  type="number"
                  inputProps={{ min: 0, max: 1000, step: 10, prefix: '€' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  onChange={(e) => setServicePrice(Number(e.target.value))}
                />
              </Stack>
            </Grid>
            <Grid item xs={10}>
              <Stack spacing={1}>
                <TextField
                  id="service_note"
                  disabled={
                    !selectedPetId ||
                    !selectedReservationId ||
                    (!selectedServiceId && !selectedOtherServiceId)
                  }
                  value={serviceNote || ''}
                  name="service_note"
                  label="Note"
                  onChange={(e) => setServiceNote(e.target.value)}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button
                disableElevation
                disabled={
                  !selectedPetId ||
                  !selectedReservationId ||
                  (!selectedServiceId && !selectedOtherServiceId) ||
                  !servicePrice
                }
                fullWidth
                size="large"
                variant="contained"
                color="primary"
                onClick={() => handleAddService()}
              >
                Aggiungi
              </Button>
            </Grid>
          </Grid>
        )}
      </MainCard>
      <MainCard
        title="Servizi erogati"
        sx={{ background: backgroundForm, marginTop: '1rem' }}
      >
        {servicesDeliveredIsLoading && <CircularProgress />}
        {servicesDeliveredData === null && (
          <Typography>
            Prenotazione con ID {selectedReservationId} non trovata
          </Typography>
        )}
        <Grid container spacing={3} columns={{ xs: 1, sm: 6, md: 12 }}>
          {!selectedReservationId && (
            <Grid item xs={12}>
              <Stack spacing={1}>
                <p>Seleziona una prenotazione</p>
              </Stack>
            </Grid>
          )}
          {selectedReservationId &&
            servicesDeliveredData &&
            servicesDeliveredData.records.length === 0 && (
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <p>Nessun servizio erogato</p>
                </Stack>
              </Grid>
            )}
          {selectedReservationId &&
            servicesDeliveredData &&
            servicesDeliveredData.records.length > 0 &&
            servicesDeliveredData.records.map(
              (service: ServiceDeliveredListType, index: number) => (
                <Fragment key={service.id}>
                  <Grid item xs={12}>
                    <Divider textAlign="left">Prestazione {index + 1}</Divider>
                  </Grid>
                  <ServiceDelivered service={service} mutate={mutate} />
                </Fragment>
              )
            )}
        </Grid>
      </MainCard>
    </>
  )
}

export default Servizi
