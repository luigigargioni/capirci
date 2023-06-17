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
import { FormAction } from './formAction'
import { ActionDetailType } from './types'

const DetailAction = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data: dataAction, isLoading: isLoadingAction } = useSWR<
    ActionDetailType,
    Error
  >(!insertMode ? { url: endpoints.home.libraries.action, body: { id } } : null)

  const backFunction = () => {
    dispatch(activeItem('actions'))
    navigate('/actions')
  }

  const { data: dataMyRobots, isLoading: isLoadingMyRobots } = useSWR<
    MyRobotType[],
    Error
  >({
    url: endpoints.home.libraries.myRobots,
  })

  const isLoading = isLoadingAction || isLoadingMyRobots
  const data = dataAction && dataMyRobots

  return (
    <MainCard
      title={insertMode ? 'Add action' : 'Action detail'}
      backFunction={backFunction}
      sx={{ background: backgroundForm }}
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && <Typography>Action with ID {id} not found</Typography>}
      {(data || insertMode) && (
        <FormAction
          dataAction={dataAction}
          dataMyRobots={dataMyRobots || []}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DetailAction
