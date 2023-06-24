import React from 'react'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Stack,
  TextField,
} from '@mui/material'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { string as YupString, object as YupObject } from 'yup'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { BuildOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { activeItem, openDrawer } from 'store/reducers/menu'
import { TaskDetailType } from './types'

export enum TypeNewTask {
  CHAT = 'chat',
  GRAPHICAL = 'graphical',
}

interface FormTaskProps {
  data: TaskDetailType | undefined
  insertMode: boolean
  backFunction: () => void
}

export const FormTask = ({ data, insertMode, backFunction }: FormTaskProps) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')

  const onSubmit = async (
    values: TaskDetailType,
    { setStatus, setSubmitting }
  ) => {
    const method = insertMode ? MethodHTTP.POST : MethodHTTP.PUT
    fetchApi({ url: endpoints.home.libraries.task, method, body: values })
      .then((res) => {
        const newTaskId = res.id
        setStatus({ success: true })
        toast.success(MessageText.success)
        if (type === TypeNewTask.CHAT) {
          dispatch(openDrawer(false))
          navigate(`/chat/${newTaskId}`)
          return
        }
        if (type === TypeNewTask.GRAPHICAL) {
          dispatch(openDrawer(false))
          navigate(`/graphical${newTaskId}`)
          return
        }
        backFunction()
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Formik
      initialValues={{
        id: data?.id || -1,
        name: data?.name || '',
        description: data?.description || '',
        shared: data?.shared || false,
      }}
      validationSchema={YupObject().shape({
        name: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
      })}
      onSubmit={onSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
        setFieldValue,
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault()
          }}
        >
          <Grid container spacing={3} columns={{ xs: 1, sm: 6, md: 12 }}>
            {!insertMode && (
              <Grid item xs={1}>
                <Stack spacing={1}>
                  <Button
                    onClick={() => {
                      dispatch(openDrawer(false))
                      dispatch(activeItem('programminggraphical'))
                      navigate(`/graphic/${values.id}`)
                    }}
                    color="primary"
                    aria-label="detail"
                    size="medium"
                    title="Edit task"
                    startIcon={<BuildOutlined style={{ fontSize: '2em' }} />}
                  >
                    Edit
                  </Button>
                </Stack>
              </Grid>
            )}
            <Grid item xs={insertMode ? 3 : 2}>
              <Stack spacing={1}>
                <TextField
                  id="name"
                  value={values.name || ''}
                  name="name"
                  label="Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.name && errors.name)}
                />
                {touched.name && errors.name && (
                  <FormHelperText error id="helper-text-name">
                    {errors.name}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={8}>
              <Stack spacing={1}>
                <TextField
                  id="description"
                  value={values.description || ''}
                  name="description"
                  label="Description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Stack>
            </Grid>
            <Grid item xs={1}>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="shared"
                      value={values.shared}
                      name="shared"
                      onBlur={handleBlur}
                      onChange={() => setFieldValue('shared', !values.shared)}
                      checked={values.shared}
                    />
                  }
                  label="Shared"
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  )
}
