import React from 'react'
import {
  Button,
  Checkbox,
  Divider,
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
import { string as YupString, object as YupObject } from 'yup'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { MyRobotType } from 'pages/myrobots/types'
import { AimOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'
import { PositionType } from 'pages/locations/types'
import { iconMap } from 'utils/iconMap'
import { ActionDetailType } from './types'

interface FormActionProps {
  dataAction: ActionDetailType | undefined
  dataMyRobots: MyRobotType[]
  insertMode: boolean
  backFunction: () => void
}

export const FormAction = ({
  dataAction,
  dataMyRobots,
  insertMode,
  backFunction,
}: FormActionProps) => {
  const onSubmit = async (
    values: ActionDetailType,
    { setStatus, setSubmitting }
  ) => {
    const method = insertMode ? MethodHTTP.POST : MethodHTTP.PUT
    fetchApi({ url: endpoints.home.libraries.action, method, body: values })
      .then(() => {
        setStatus({ success: true })
        toast.success(MessageText.success)
        backFunction()
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handleGetPosition = async (
    robot: number | null,
    point: string,
    setFieldValue: (field: string, value: any) => void,
    setFieldError: (field: string, value: any) => void,
    setFieldTouched: (field: string, touched: any) => void
  ) => {
    if (!robot) {
      await setFieldTouched('robot', true)
      await setFieldError('robot', MessageText.requiredField)
      return
    }
    fetchApi({
      url: endpoints.home.libraries.takePosition,
      method: MethodHTTP.POST,
      body: { robot },
    }).then((response) => {
      if (response) {
        const newPoint = response.position
        const pointObj = JSON.parse(point)
        const newArray = [...pointObj.points, newPoint]
        const newPointObj = { ...pointObj, points: newArray }
        setFieldValue('point', JSON.stringify(newPointObj))
      }
    })
  }

  const handleDelete = (
    point: string,
    index: number,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const pointObj = JSON.parse(point)
    const newArray = pointObj.points.filter((_item, i) => i !== index)
    const newPointObj = { ...pointObj, points: newArray }
    setFieldValue('point', JSON.stringify(newPointObj))
  }

  return (
    <Formik
      initialValues={{
        id: dataAction?.id || -1,
        name: dataAction?.name || '',
        shared: dataAction?.shared || false,
        positions: dataAction?.positions || '',
        robot: dataAction?.robot || null,
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
            <Grid item xs={12}>
              <Divider textAlign="left">Points</Divider>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Button
                  onClick={() =>
                    handleGetPosition(
                      values.robot,
                      values.positions,
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
                  Get point
                </Button>
              </Stack>
            </Grid>
            {values.positions &&
              JSON.parse(values.positions).points.map(
                (point: PositionType, index: number) => (
                  <React.Fragment key={JSON.stringify(point)}>
                    <Grid item xs={10}>
                      <Stack spacing={1}>
                        <TextField
                          id={`point-${index}`}
                          value={JSON.stringify(point)}
                          name={`point-${index}`}
                          label={`Point ${index + 1}`}
                          disabled
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={2}>
                      <Stack spacing={1}>
                        <Popconfirm
                          title="Delete?"
                          onConfirm={() =>
                            handleDelete(values.positions, index, setFieldValue)
                          }
                          okText="Ok"
                          cancelText="Cancel"
                          icon={iconMap.deleteCircle}
                        >
                          <Button color="error">Delete</Button>
                        </Popconfirm>
                      </Stack>
                    </Grid>
                  </React.Fragment>
                )
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
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  )
}
