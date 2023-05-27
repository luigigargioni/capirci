import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { backgroundForm } from 'themes/theme'
import { FormAnimale } from './formAnimale'
import { AnimaleType } from './types'

const DettaglioAnimale = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data, isLoading } = useSWR<AnimaleType, Error>(
    !insertMode
      ? {
          mod: endpoints.pet.get.mod,
          fnz: endpoints.pet.get.fnz,
          body: {
            id,
          },
        }
      : null
  )

  const backFunction = () => {
    dispatch(activeItem('animali'))
    navigate('/animali')
  }

  return (
    <MainCard
      title={insertMode ? 'Aggiunta animale' : 'Dettaglio animale'}
      backFunction={backFunction}
      sx={{ background: backgroundForm }}
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && (
        <Typography>Animale con ID {id} non trovato</Typography>
      )}
      {(data || insertMode) && (
        <FormAnimale
          data={data}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DettaglioAnimale
