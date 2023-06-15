import React from 'react'
import { CircularProgress, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import { useDispatch } from 'react-redux'

import { MainCard } from 'components/MainCard'
import { endpoints } from 'services/endpoints'
import { activeItem } from 'store/reducers/menu'
import { backgroundForm } from 'themes/theme'
import { FormObject } from './formObject'
import { ObjectDetailType } from './types'

const DetailObject = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const insertMode = id === 'add'
  const { data, isLoading } = useSWR<ObjectDetailType, Error>(
    !insertMode ? { url: endpoints.home.libraries.object, body: { id } } : null
  )

  const backFunction = () => {
    dispatch(activeItem('objects'))
    navigate('/objects')
  }

  return (
    <MainCard
      title={insertMode ? 'Add object' : 'Object detail'}
      backFunction={backFunction}
      sx={{ background: backgroundForm }}
    >
      {isLoading && !insertMode && <CircularProgress />}
      {data === null && <Typography>Object with ID {id} not found</Typography>}
      {(data || insertMode) && (
        <FormObject
          data={data}
          insertMode={insertMode}
          backFunction={backFunction}
        />
      )}
    </MainCard>
  )
}

export default DetailObject
