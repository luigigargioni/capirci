import React from 'react'
import { Button, FormHelperText, Grid, Stack, TextField } from '@mui/material'
import { Formik } from 'formik'
import { string as YupString, object as YupObject, ref as YupRef } from 'yup'
import { toast } from 'react-toastify'

import { MainCard } from 'components/MainCard'
import {
  MessageText,
  MessageTextMinLength,
  MessageTextMaxLength,
} from 'utils/messages'
import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'

const ChangePassword = () => {
  return (
    <MainCard title="Change password">
      <Formik
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={YupObject().shape({
          oldPassword: YupString().required(MessageText.requiredField),
          newPassword: YupString()
            .min(8, MessageTextMinLength(8))
            .max(255, MessageTextMaxLength(255))
            .required(MessageText.requiredField),
          confirmNewPassword: YupString()
            .required(MessageText.requiredField)
            .oneOf([YupRef('newPassword')], MessageText.passwordMismatch),
        })}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          const { oldPassword, newPassword } = values
          fetchApi(endpoints.home.user.changePassword, MethodHTTP.POST, {
            oldPassword,
            newPassword,
          })
            .then((res) => {
              if (res?.bool) {
                toast.success(MessageText.success)
                setStatus({ success: true })
                return
              }
              toast.error(MessageText.serverError)
              setStatus({ success: false })
            })
            .finally(() => {
              setSubmitting(false)
            })
        }}
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
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <TextField
                    id="oldPassword"
                    type="password"
                    value={values.oldPassword}
                    name="oldPassword"
                    label="Current password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.oldPassword && errors.oldPassword)}
                  />
                  {touched.oldPassword && errors.oldPassword && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-oldPassword"
                    >
                      {errors.oldPassword}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <TextField
                    error={Boolean(touched.newPassword && errors.newPassword)}
                    id="newPassword"
                    type="password"
                    value={values.newPassword}
                    name="newPassword"
                    label="New password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                  />
                  {touched.newPassword && errors.newPassword && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-newPassword"
                    >
                      {errors.newPassword}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <TextField
                    error={Boolean(
                      touched.confirmNewPassword && errors.confirmNewPassword
                    )}
                    id="confirmNewPassword"
                    type="password"
                    value={values.confirmNewPassword}
                    name="confirmNewPassword"
                    label="Confirm new password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    fullWidth={false}
                  />
                  {touched.confirmNewPassword && errors.confirmNewPassword && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text-confirmNewPassword"
                    >
                      {errors.confirmNewPassword}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Button
                  disabled={isSubmitting}
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
    </MainCard>
  )
}

export default ChangePassword
