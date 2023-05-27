import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'

import { AdditionalAction, MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import {
  DettaglioPrenotazioneType,
  GroomingServicesType,
  PaymentMethodType,
} from 'pages/prenotazioni/types'
import { useDispatch } from 'react-redux'
import { activeItem } from 'store/reducers/menu'
import { backgroundForm } from 'themes/theme'
import { ServiceDeliveredListType } from 'pages/servizi/types'
import { FormPrenotazione } from './formPrenotazione'

const DettaglioPrenotazione = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const insertMode = id === 'add'
  const [searchParams] = useSearchParams()

  const isCheckin = searchParams.get('type') === 'checkin'
  const isCheckout = searchParams.get('type') === 'checkout'
  const isHistory = searchParams.get('type') === 'history'

  const isDetailCheckin = searchParams.get('type') === 'detailCheckin'
  const isDetailCheckout = searchParams.get('type') === 'detailCheckout'
  const isDetailHistory = searchParams.get('type') === 'detailHistory'

  const { data: prenotazioneData, isLoading: prenotazioneIsLoading } = useSWR<
    DettaglioPrenotazioneType,
    Error
  >(
    !insertMode
      ? {
          mod: endpoints.reservation.get.mod,
          fnz: endpoints.reservation.get.fnz,
          body: {
            id,
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
    },
  })

  const { data: paymentMethodData, isLoading: paymentMethodIsLoading } = useSWR<
    { cnt: number; records: PaymentMethodType[] },
    Error
  >({
    mod: endpoints.reservation.paymentMethods.mod,
    fnz: endpoints.reservation.paymentMethods.fnz,
  })

  const { data: servicesDeliveredData, isLoading: servicesDeliveredIsLoading } =
    useSWR<{ cnt: number; records: ServiceDeliveredListType[] }, Error>(
      isCheckout
        ? {
            mod: endpoints.services.listDelivered.mod,
            fnz: endpoints.services.listDelivered.fnz,
            body: {
              reservation_id: id,
            },
          }
        : null
    )

  const backFunction = () => {
    if (isDetailCheckin || isCheckin) {
      dispatch(activeItem('checkin'))
      navigate('/checkin')
    } else if (isDetailCheckout || isCheckout) {
      dispatch(activeItem('checkout'))
      navigate('/checkout')
    } else if (isHistory || isDetailHistory) {
      dispatch(activeItem('storico'))
      navigate('/storico')
    }
  }

  const isLoading =
    (prenotazioneIsLoading && !insertMode) ||
    groomingIsLoading ||
    paymentMethodIsLoading ||
    (servicesDeliveredIsLoading && isCheckout)

  const data =
    (prenotazioneData || insertMode) &&
    groomingData &&
    paymentMethodData &&
    (servicesDeliveredData || !isCheckout)

  const additionalActions: AdditionalAction[] = []
  if (isDetailCheckin && !insertMode) {
    const linkCheckin = `https://capriccididama.altervista.org/pdf/condizioni.pdf`
    additionalActions.push({
      label: 'Condizioni',
      action: () => window.open(linkCheckin),
    })
  }

  return (
    <MainCard
      title={insertMode ? 'Aggiunta prenotazione' : 'Dettaglio prenotazione'}
      backFunction={backFunction}
      additionalAction={additionalActions}
      sx={{ background: backgroundForm }}
    >
      {isLoading && <CircularProgress />}
      {prenotazioneData === null && (
        <Typography>Prenotazione con ID {id} non trovata</Typography>
      )}
      {data && (
        <FormPrenotazione
          prenotazioneData={prenotazioneData}
          groomingData={groomingData.records || []}
          paymentMethodData={paymentMethodData.records || []}
          servicesDelivered={servicesDeliveredData?.records || []}
          isCheckin={isCheckin}
          isCheckout={isCheckout}
          isHistory={isHistory}
          isDetailCheckin={isDetailCheckin}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DettaglioPrenotazione
