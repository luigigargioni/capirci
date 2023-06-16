import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { backgroundForm } from 'themes/theme'
import { MyRobotType } from 'pages/myrobots/types'
import { FormLocation } from './formLocation'
import { LocationDetailType } from './types'

const DetailLocation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data: dataLocation, isLoading: isLoadingLocation } = useSWR<
    LocationDetailType,
    Error
  >(
    !insertMode
      ? { url: endpoints.home.libraries.location, body: { id } }
      : null
  )

  const backFunction = () => {
    dispatch(activeItem('locations'))
    navigate('/locations')
  }

  const { data: dataMyRobots, isLoading: isLoadingMyRobots } = useSWR<
    MyRobotType[],
    Error
  >({
    url: endpoints.home.libraries.myRobots,
  })

  const isLoading = isLoadingLocation || isLoadingMyRobots
  const data = dataLocation && dataMyRobots

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
          dataLocation={dataLocation}
          dataMyRobots={dataMyRobots || []}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DetailLocation
