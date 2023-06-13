import React from 'react'
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
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
  mixed as YupMixed,
} from 'yup'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { UserType } from 'pages/utenti/types'
import { USER_GROUP } from 'utils/constants'

interface FormUtenteProps {
  data: UserType | undefined
  insertMode: boolean
  backFunction: () => void
}

export const FormUtente = ({
  data,
  insertMode,
  backFunction,
}: FormUtenteProps) => {
  const onSubmit = async (
    values: UserType,
    { setErrors, setStatus, setSubmitting }
  ) => {
    fetchApi({
      mod: insertMode ? endpoints.user.add.mod : endpoints.user.update.mod,
      fnz: insertMode ? endpoints.user.add.fnz : endpoints.user.update.fnz,
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
        email: data?.email || '',
        role: data?.role || null,
        active: data?.active || 1,
      }}
      validationSchema={YupObject().shape({
        first_name: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        last_name: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        email: YupString()
          .email(MessageText.emailNotValid)
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        role: YupMixed<USER_GROUP>()
          .oneOf(
            [USER_GROUP.ADMIN, USER_GROUP.OPERATOR],
            MessageText.valueNotValid
          )
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
            <Grid item xs={2}>
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
                <FormControl fullWidth>
                  <InputLabel id="role-label">Ruolo</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    value={values.role || ''}
                    label="Ruolo"
                    name="role"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.role && errors.role)}
                  >
                    <MenuItem value={USER_GROUP.OPERATOR}>Operatore</MenuItem>
                    <MenuItem value={USER_GROUP.ADMIN}>Amministratore</MenuItem>
                  </Select>
                  {touched.role && errors.role && (
                    <FormHelperText error id="helper-text-role">
                      {errors.role}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            {!insertMode && (
              <Grid item xs={1}>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id="active"
                        value={values.active}
                        name="active"
                        disabled
                        onChange={() =>
                          setFieldValue('active', values.active === 1 ? 0 : 1)
                        }
                        onBlur={handleBlur}
                        checked={values.active === 1}
                      />
                    }
                    label="Attivo"
                  />
                </Stack>
              </Grid>
            )}
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
