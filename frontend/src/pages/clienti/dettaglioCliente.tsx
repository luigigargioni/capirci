import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { ClienteType } from 'pages/clienti/types'
import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { FormCliente } from 'pages/clienti/formCliente'
import { useDispatch } from 'react-redux'
import { activeItem } from 'store/reducers/menu'
import { backgroundForm } from 'themes/theme'

const DettaglioCliente = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data, isLoading } = useSWR<ClienteType, Error>(
    !insertMode
      ? {
          mod: endpoints.customer.get.mod,
          fnz: endpoints.customer.get.fnz,
          body: {
            id,
          },
        }
      : null
  )

  const backFunction = () => {
    dispatch(activeItem('clienti'))
    navigate('/clienti')
  }

  return (
    <MainCard
      title={insertMode ? 'Aggiunta cliente' : 'Dettaglio cliente'}
      backFunction={backFunction}
      sx={{ background: backgroundForm }}
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && (
        <Typography>Cliente con ID {id} non trovato</Typography>
      )}
      {(data || insertMode) && (
        <FormCliente
          data={data}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DettaglioCliente
