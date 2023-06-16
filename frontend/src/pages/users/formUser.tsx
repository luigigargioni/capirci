import React from 'react'
import { Button, FormHelperText, Grid, Stack, TextField } from '@mui/material'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { string as YupString, object as YupObject } from 'yup'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { UserType } from './types'

interface FormUserProps {
  data: UserType | undefined
  insertMode: boolean
  backFunction: () => void
}

export const FormUser = ({ data, insertMode, backFunction }: FormUserProps) => {
  const onSubmit = async (values: UserType, { setStatus, setSubmitting }) => {
    const method = insertMode ? MethodHTTP.POST : MethodHTTP.PUT
    fetchApi({ url: endpoints.home.management.user, method, body: values })
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
        username: data?.username || '',
      }}
      validationSchema={YupObject().shape({
        username: YupString()
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
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="username"
                  value={values.username || ''}
                  name="username"
                  label="Username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.username && errors.username)}
                />
                {touched.username && errors.username && (
                  <FormHelperText error id="helper-text-username">
                    {errors.username}
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
