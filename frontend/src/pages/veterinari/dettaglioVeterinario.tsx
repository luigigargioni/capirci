import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { useDispatch } from 'react-redux'
import { backgroundForm } from 'themes/theme'
import { FormVeterinario } from './formVeterinario'
import { VeterinarianType } from './types'

const DettaglioVeterinario = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data, isLoading } = useSWR<VeterinarianType, Error>(
    !insertMode
      ? {
          mod: endpoints.veterinarian.get.mod,
          fnz: endpoints.veterinarian.get.fnz,
          body: {
            id,
          },
        }
      : null
  )

  const backFunction = () => {
    dispatch(activeItem('veterinari'))
    navigate('/veterinari')
  }

  return (
    <MainCard
      title={insertMode ? 'Aggiunta veterinario' : 'Dettaglio veterinario'}
      backFunction={backFunction}
      sx={{ background: backgroundForm }}
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && (
        <Typography>Veterinario con ID {id} non trovato</Typography>
      )}
      {(data || insertMode) && (
        <FormVeterinario
          data={data}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DettaglioVeterinario
