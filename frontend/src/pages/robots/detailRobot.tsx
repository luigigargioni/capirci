import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { backgroundForm } from 'themes/theme'
import { FormRobot } from './formRobot'
import { RobotType } from './types'

const DetailRobot = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data, isLoading } = useSWR<RobotType, Error>(
    !insertMode ? { url: endpoints.home.management.robot, body: { id } } : null
  )

  const backFunction = () => {
    dispatch(activeItem('robots'))
    navigate('/robots')
  }

  return (
    <MainCard
      title={insertMode ? 'Add Robot' : 'Robot detail'}
      backFunction={backFunction}
      sx={{ background: backgroundForm }}
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && <Typography>Robot with ID {id} not found</Typography>}
      {(data || insertMode) && (
        <FormRobot
          data={data}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DetailRobot
