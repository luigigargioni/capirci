import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
} from '@mui/material'
import { string as YupString, object as YupObject } from 'yup'
import { Formik } from 'formik'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { LocalStorageKey, setToLocalStorage } from 'utils/localStorageUtils'
import { defaultPath, USER_ROLE } from 'utils/constants'
import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'

export interface UserLoginInterface {
  id: string
  email: string
  first_name: string
  last_name: string
  role: USER_ROLE
}

interface LoginFormProps {
  setResetPassword: (value: boolean) => void
}

export const LoginForm = ({ setResetPassword }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const navigate = useNavigate()

  const onSubmit = async (
    values: {
      email: string
      password: string
    },
    { setErrors, setStatus, setSubmitting }
  ) => {
    fetchApi({
      mod: endpoints.user.login.mod,
      fnz: endpoints.user.login.fnz,
      body: values,
      methodApi: MethodHTTP.POST,
    })
      .then((res) => {
        if (res?.bool) {
          const userInfo: UserLoginInterface = {
            id: res.data.id,
            email: res.data.email,
            first_name: res.data.first_name,
            last_name: res.data.last_name,
            role: res.data.role as USER_ROLE,
          }
          setToLocalStorage(LocalStorageKey.TOKEN, res.data.token)
          setToLocalStorage(LocalStorageKey.USER, userInfo)
          navigate(defaultPath)
          setStatus({ success: true })
          return
        }
        setStatus({ success: false })
        if (res?.bool === false) {
          setErrors({
            email: MessageText.invalidCredentials,
            password: MessageText.invalidCredentials,
          })
          return
        }
        setErrors({
          email: MessageText.noConnection,
          password: MessageText.noConnection,
        })
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={YupObject().shape({
        email: YupString()
          .email(MessageText.emailNotValid)
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        password: YupString()
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
        <form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <TextField
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  label="Email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
                {touched.email && errors.email && (
                  <FormHelperText
                    error
                    id="helper-text-email-login"
                    style={{ marginTop: 3 }}
                  >
                    {errors.email}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <FormControl>
                  <InputLabel
                    htmlFor="password-login"
                    error={Boolean(touched.password && errors.password)}
                  >
                    Password
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="inverti visibilità password"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? (
                            <EyeOutlined />
                          ) : (
                            <EyeInvisibleOutlined />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {touched.password && errors.password && (
                    <FormHelperText
                      error
                      id="helper-text-password-login"
                      style={{ margin: 0, marginTop: 3 }}
                    >
                      {errors.password}
                    </FormHelperText>
                  )}
                </FormControl>
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
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                size="small"
                variant="text"
                color="primary"
                onClick={() => setResetPassword(true)}
              >
                Dimenticato la password?
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  )
}
