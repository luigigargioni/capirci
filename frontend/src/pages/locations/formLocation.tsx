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
import { LocationDetailType } from './types'

interface FormAnimaleProps {
  data: LocationDetailType | undefined
  insertMode: boolean
  backFunction: () => void
}

export const FormLocation = ({
  data,
  insertMode,
  backFunction,
}: FormAnimaleProps) => {
  const onSubmit = async (
    values: LocationDetailType,
    { setStatus, setSubmitting }
  ) => {
    const method = insertMode ? MethodHTTP.POST : MethodHTTP.PUT
    fetchApi({ url: endpoints.home.libraries.location, method, body: values })
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
        shared: data?.shared || false,
        position: data?.position || '',
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
            <Grid item xs={2}>
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
