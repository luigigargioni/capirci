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
  number as YupNumber,
} from 'yup'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { AimOutlined } from '@ant-design/icons'
import { MyRobotType } from 'pages/myrobots/types'
import { LocationDetailType } from './types'

interface FormLocationProps {
  dataLocation: LocationDetailType | undefined
  dataMyRobots: MyRobotType[]
  insertMode: boolean
  backFunction: () => void
}

export const FormLocation = ({
  dataLocation,
  dataMyRobots,
  insertMode,
  backFunction,
}: FormLocationProps) => {
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

  const handleGetPosition = (
    robot: number | null,
    setFieldValue: (field: string, value: any) => void,
    setFieldError: (field: string, value: any) => void,
    setFieldTouched: (field: string, touched: any) => void
  ) => {
    if (robot === -1) {
      setFieldTouched('robot', true)
      setFieldError('robot', MessageText.requiredField)
      return
    }
    fetchApi({
      url: endpoints.home.libraries.takePositionLocation,
      method: MethodHTTP.POST,
      body: { robot },
    }).then((response) => {
      if (response) {
        setFieldValue('position', response.position)
      }
    })
  }

  return (
    <Formik
      initialValues={{
        id: dataLocation?.id || -1,
        name: dataLocation?.name || '',
        shared: dataLocation?.shared || false,
        position: dataLocation?.position || '',
        robot: dataLocation?.robot || null,
      }}
      validationSchema={YupObject().shape({
        name: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        robot: YupNumber()
          .required(MessageText.requiredField)
          .min(0, MessageText.requiredField),
        position: YupString().required(MessageText.requiredField),
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
        setFieldError,
        setFieldTouched,
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
            <Grid item xs={9}>
              <Stack spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="robot-id-label">Robot</InputLabel>
                  <Select
                    labelId="robot-id-label"
                    id="robot"
                    value={values.robot || ''}
                    label="Robot"
                    name="robot"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      setFieldValue('robot', e.target.value)
                      setFieldValue('position', '')
                    }}
                    error={Boolean(touched.robot && errors.robot)}
                  >
                    {dataMyRobots?.map((myRobot) => (
                      <MenuItem value={myRobot.id} key={myRobot.id}>
                        {myRobot.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.robot && errors.robot && (
                    <FormHelperText error id="helper-text-robot">
                      {errors.robot}
                    </FormHelperText>
                  )}
                </FormControl>
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
            <Grid item xs={2}>
              <Stack spacing={1}>
                <Button
                  onClick={() =>
                    handleGetPosition(
                      values.robot,
                      setFieldValue,
                      setFieldError,
                      setFieldTouched
                    )
                  }
                  color="primary"
                  aria-label="detail"
                  size="medium"
                  title="Get position"
                  startIcon={<AimOutlined style={{ fontSize: '2em' }} />}
                >
                  Get position
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={10}>
              <Stack spacing={1}>
                <TextField
                  id="position"
                  value={values.position || ''}
                  name="position"
                  label="Position"
                  disabled
                  error={Boolean(touched.position && errors.position)}
                />
                {touched.position && errors.position && (
                  <FormHelperText error id="helper-text-position">
                    {errors.position}
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
