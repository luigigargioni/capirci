import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { backgroundForm } from 'themes/theme'
import { FormLocation } from './formLocation'
import { LocationDetailType } from './types'

const DetailLocation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data, isLoading } = useSWR<LocationDetailType, Error>(
    !insertMode
      ? { url: endpoints.home.libraries.location, body: { id } }
      : null
  )

  const backFunction = () => {
    dispatch(activeItem('locations'))
    navigate('/locations')
  }

  return (
    <MainCard
      title={insertMode ? 'Add location' : 'Location detail'}
      backFunction={backFunction}
      sx={{ background: backgroundForm }}
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && (
        <Typography>Location with ID {id} not found</Typography>
      )}
      {(data || insertMode) && (
        <FormLocation
          data={data}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DetailLocation
