import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { backgroundForm } from 'themes/theme'
import { FormMyRobot } from './formMyRobot'
import { MyRobotDetailType } from './types'

const DetailMyRobot = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data, isLoading } = useSWR<MyRobotDetailType, Error>(
    !insertMode ? { url: endpoints.home.libraries.myRobot, body: { id } } : null
  )

  const backFunction = () => {
    dispatch(activeItem('myrobots'))
    navigate('/myrobots')
  }

  return (
    <MainCard
      title={insertMode ? 'Add My Robot' : 'My Robot detail'}
      backFunction={backFunction}
      sx={{ background: backgroundForm }}
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && (
        <Typography>My Robot with ID {id} not found</Typography>
      )}
      {(data || insertMode) && (
        <FormMyRobot
          data={data}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DetailMyRobot
