import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { FormUtente } from 'pages/utenti/formUtente'
import { UserType } from 'pages/utenti/types'
import { activeItem } from 'store/reducers/menu'
import { useDispatch } from 'react-redux'
import { backgroundForm } from 'themes/theme'

const DettaglioUtente = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data, isLoading } = useSWR<UserType, Error>(
    !insertMode
      ? {
          mod: endpoints.user.get.mod,
          fnz: endpoints.user.get.fnz,
          body: {
            id,
          },
        }
      : null
  )

  const backFunction = () => {
    dispatch(activeItem('utenti'))
    navigate('/utenti')
  }

  return (
    <MainCard
      title={insertMode ? 'Aggiunta utente' : 'Dettaglio utente'}
      backFunction={backFunction}
      sx={{ background: backgroundForm }}
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && <Typography>Utente con ID {id} non trovato</Typography>}
      {(data || insertMode) && (
        <FormUtente
          data={data}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DettaglioUtente
