import React from 'react'
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import {
  string as YupString,
  object as YupObject,
  number as YupNumber,
} from 'yup'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { RobotModel, RobotType } from './types'

interface FormRobotProps {
  data: RobotType | undefined
  insertMode: boolean
  backFunction: () => void
}

export const FormRobot = ({
  data,
  insertMode,
  backFunction,
}: FormRobotProps) => {
  const onSubmit = async (values: RobotType, { setStatus, setSubmitting }) => {
    const method = insertMode ? MethodHTTP.POST : MethodHTTP.PUT
    fetchApi({ url: endpoints.home.management.robot, method, body: values })
      .then(() => {
        setStatus({ success: true })
        toast.success(MessageText.success)
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
        ip: data?.ip || '',
        port: data?.port || 0,
        model: data?.model || '',
        cameraip: data?.cameraip || '',
      }}
      validationSchema={YupObject().shape({
        name: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        ip: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        model: YupString().required(MessageText.requiredField),
        port: YupNumber().required(MessageText.requiredField),
        cameraip: YupString()
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
      }) => (
        <form
          noValidate
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.preventDefault()
          }}
        >
          <Grid container spacing={3} columns={{ xs: 1, sm: 6, md: 12 }}>
            <Grid item xs={3}>
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
            <Grid item xs={3}>
              <Stack spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="model-label">Model</InputLabel>
                  <Select
                    labelId="model-label"
                    id="model"
                    value={values.model || ''}
                    label="Model"
                    name="model"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.model && errors.model)}
                  >
                    {Object.entries(RobotModel).map(([k, v]) => (
                      <MenuItem value={k} key={k}>
                        {v}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.model && errors.model && (
                    <FormHelperText error id="helper-text-model">
                      {errors.model}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="ip"
                  value={values.ip || ''}
                  name="ip"
                  label="IP"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 15,
                  }}
                  error={Boolean(touched.ip && errors.ip)}
                />
                {touched.ip && errors.ip && (
                  <FormHelperText error id="helper-text-ip">
                    {errors.ip}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="port"
                  value={values.port || 0}
                  name="port"
                  label="Port"
                  type="number"
                  inputProps={{ min: 0, max: 65535, step: 1 }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.port && errors.port)}
                />
                {touched.port && errors.port && (
                  <FormHelperText error id="helper-text-port">
                    {errors.port}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="cameraip"
                  value={values.cameraip || ''}
                  name="cameraip"
                  label="Camera IP"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 15,
                  }}
                  error={Boolean(touched.cameraip && errors.cameraip)}
                />
                {touched.cameraip && errors.cameraip && (
                  <FormHelperText error id="helper-text-cameraip">
                    {errors.cameraip}
                  </FormHelperText>
                )}
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
