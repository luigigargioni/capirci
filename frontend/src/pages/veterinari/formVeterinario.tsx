import React from 'react'
import { Button, FormHelperText, Grid, Stack, TextField } from '@mui/material'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { string as YupString, object as YupObject } from 'yup'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { VeterinarianType } from 'pages/veterinari/types'

interface FormVeterinarioProps {
  data: VeterinarianType | undefined
  insertMode: boolean
  backFunction: () => void
}

export const FormVeterinario = ({
  data,
  insertMode,
  backFunction,
}: FormVeterinarioProps) => {
  const onSubmit = async (
    values: VeterinarianType,
    { setErrors, setStatus, setSubmitting }
  ) => {
    fetchApi({
      mod: insertMode
        ? endpoints.veterinarian.insert.mod
        : endpoints.veterinarian.update.mod,
      fnz: insertMode
        ? endpoints.veterinarian.insert.fnz
        : endpoints.veterinarian.update.fnz,
      body: values,
      methodApi: MethodHTTP.POST,
    })
      .then((res) => {
        if (res?.bool) {
          setStatus({ success: true })
          toast.success(MessageText.success)
          backFunction()
          return
        }
        if (insertMode) {
          setErrors({ email: MessageText.emailAlreadyExists })
          toast.error(MessageText.emailAlreadyExists)
          setStatus({ success: false })
          return
        }
        toast.error(MessageText.serverError)
        setStatus({ success: false })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Formik
      initialValues={{
        id: data?.id || -1,
        first_name: data?.first_name || '',
        last_name: data?.last_name || '',
        zip: data?.zip || '',
        state: data?.state || '',
        address: data?.address || '',
        city: data?.city || '',
        phone: data?.phone || '',
        mobile: data?.mobile || '',
        emergency: data?.emergency || '',
        email: data?.email || '',
        company: data?.company || '',
      }}
      validationSchema={YupObject().shape({
        company: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        emergency: YupString()
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
                  id="emergency"
                  value={values.emergency || ''}
                  name="emergency"
                  label="Urgenze"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.emergency && errors.emergency)}
                />
                {touched.emergency && errors.emergency && (
                  <FormHelperText error id="helper-text-emergency">
                    {errors.emergency}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="company"
                  value={values.company || ''}
                  name="company"
                  label="Studio"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.company && errors.company)}
                />
                {touched.company && errors.company && (
                  <FormHelperText error id="helper-text-company">
                    {errors.company}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={1}>
              <Stack spacing={1}>
                <TextField
                  id="first_name"
                  value={values.first_name || ''}
                  name="first_name"
                  label="Nome"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.first_name && errors.first_name)}
                />
                {touched.first_name && errors.first_name && (
                  <FormHelperText error id="helper-text-first_name">
                    {errors.first_name}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={1}>
              <Stack spacing={1}>
                <TextField
                  id="last_name"
                  value={values.last_name || ''}
                  name="last_name"
                  label="Cognome"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.last_name && errors.last_name)}
                />
                {touched.last_name && errors.last_name && (
                  <FormHelperText error id="helper-text-last_name">
                    {errors.last_name}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="email"
                  value={values.email || ''}
                  type="email"
                  name="email"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.email && errors.email)}
                />
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email">
                    {errors.email}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="phone"
                  value={values.phone || ''}
                  name="phone"
                  label="Telefono"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.phone && errors.phone)}
                />
                {touched.phone && errors.phone && (
                  <FormHelperText error id="helper-text-phone">
                    {errors.phone}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="mobile"
                  value={values.mobile || ''}
                  name="mobile"
                  label="Cellulare"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.mobile && errors.mobile)}
                />
                {touched.mobile && errors.mobile && (
                  <FormHelperText error id="helper-text-mobile">
                    {errors.mobile}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={1}>
                <TextField
                  id="city"
                  value={values.city || ''}
                  name="city"
                  label="Città"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.city && errors.city)}
                />
                {touched.city && errors.city && (
                  <FormHelperText error id="helper-text-city">
                    {errors.city}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={1}>
                <TextField
                  id="address"
                  value={values.address || ''}
                  name="address"
                  label="Indirizzo"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.address && errors.address)}
                />
                {touched.address && errors.address && (
                  <FormHelperText error id="helper-text-address">
                    {errors.address}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="zip"
                  value={values.zip || ''}
                  name="zip"
                  label="CAP"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.zip && errors.zip)}
                />
                {touched.zip && errors.zip && (
                  <FormHelperText error id="helper-text-zip">
                    {errors.zip}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="state"
                  value={values.state || ''}
                  name="state"
                  label="Provincia"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.state && errors.state)}
                />
                {touched.state && errors.state && (
                  <FormHelperText error id="helper-text-state">
                    {errors.state}
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
                Salva
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  )
}
