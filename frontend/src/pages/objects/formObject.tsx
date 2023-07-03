import React from 'react'
import {
  Button,
  CardMedia,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { string as YupString, object as YupObject } from 'yup'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { AimOutlined, PlusOutlined } from '@ant-design/icons'
import { MyRobotType } from 'pages/myrobots/types'
import { ObjectDetailType } from './types'

interface FormObjectProps {
  dataObject: ObjectDetailType | undefined
  dataMyRobots: MyRobotType[] | undefined
  insertMode: boolean
  backFunction: () => void
}

export const FormObject = ({
  dataObject,
  dataMyRobots,
  insertMode,
  backFunction,
}: FormObjectProps) => {
  const [addKeyword, setAddKeyword] = React.useState<string>('')
  const [keywordErrors, setKeywordErrors] = React.useState<string[]>([])

  const onSubmit = async (
    values: ObjectDetailType,
    { setStatus, setSubmitting, setFieldError, setFieldTouched }
  ) => {
    const method = insertMode ? MethodHTTP.POST : MethodHTTP.PUT
    setKeywordErrors([])
    fetchApi({ url: endpoints.home.libraries.object, method, body: values })
      .then(async (res) => {
        if (res && res.nameAlreadyExists) {
          await setFieldTouched('name', true)
          await setFieldError('name', MessageText.alreadyExists)
          setStatus({ success: false })
          return
        }
        if (res && res.keywordExist) {
          setKeywordErrors(res.keywordFound)
          setStatus({ success: false })
          return
        }
        setStatus({ success: true })
        toast.success(MessageText.success)
        backFunction()
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handleGetHeight = async (
    robot: number | null,
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
        setFieldValue('height', response.position.Z)
      }
    })
  }

  const handleGetPhoto = async (
    robot: number | null,
    setFieldValue: (field: string, value: any) => void,
    setFieldError: (field: string, value: any) => void,
    setFieldTouched: (
      field: string,
      isTouched: boolean,
      shouldValidate: boolean
    ) => void
  ) => {
    if (!robot) {
      await setFieldTouched('robot', true, true)
      await setFieldError('robot', MessageText.requiredField)
      return
    }
    fetchApi({
      url: endpoints.home.libraries.getObjectPhoto,
      method: MethodHTTP.POST,
      body: { robot },
    }).then((response) => {
      if (response) {
        setFieldValue('photo', response.photo)
        setFieldValue('contour', response.contour)
        setFieldValue('shape', response.shape)
      }
    })
  }

  return (
    <Formik
      initialValues={{
        id: dataObject?.id || -1,
        name: dataObject?.name || '',
        shared: dataObject?.shared || false,
        force: dataObject?.force || 0,
        height: dataObject?.height || null,
        keywords: dataObject?.keywords || [],
        robot: dataObject?.robot || null,
        photo: dataObject?.photo || '',
        contour: dataObject?.contour || '',
        shape: dataObject?.shape || '',
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
                <FormControl fullWidth>
                  <InputLabel id="robot-id-label">Robot</InputLabel>
                  <Select
                    labelId="robot-id-label"
                    id="robot"
                    value={values.robot || ''}
                    label="Robot"
                    name="robot"
                    onBlur={handleBlur}
                    onChange={handleChange}
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
            <Grid item xs={2}>
              <Stack spacing={1}>
                <Button
                  onClick={() =>
                    handleGetHeight(
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
                  Get height
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="height"
                  value={values.height || ''}
                  name="height"
                  label="Height"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled
                  error={Boolean(touched.height && errors.height)}
                />
                {touched.height && errors.height && (
                  <FormHelperText error id="helper-text-height">
                    {errors.height}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <Typography id="slider-label">Force</Typography>
                <Slider
                  id="force"
                  name="force"
                  value={values.force || 1}
                  valueLabelFormat={(val: number) => {
                    if (val === 1) return 'Low'
                    switch (val) {
                      case 1:
                        return 'Low'
                      case 2:
                        return 'Medium'
                      case 3:
                        return 'High'
                      default:
                        return ''
                    }
                  }}
                  aria-label="Force"
                  onChange={handleChange}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={3}
                  style={{ marginTop: 0 }}
                />
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="add_keyword"
                  value={addKeyword || ''}
                  name="add_keyword"
                  label="Add keyword"
                  onChange={(e) => setAddKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (addKeyword) {
                        const newKeywords = [...values.keywords]
                        newKeywords.push(addKeyword)
                        setFieldValue('keywords', newKeywords)
                        setAddKeyword('')
                      }
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => {
                            if (addKeyword) {
                              const newKeywords = [...values.keywords]
                              newKeywords.push(addKeyword)
                              setFieldValue('keywords', newKeywords)
                              setAddKeyword('')
                            }
                          }}
                          disabled={
                            !addKeyword || values.keywords.includes(addKeyword)
                          }
                          edge="end"
                        >
                          <PlusOutlined />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={10}>
              <Stack spacing={1} direction="row">
                {values.keywords.map((keyword, index) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    variant="outlined"
                    onDelete={() => {
                      const newKeywords = [...values.keywords]
                      newKeywords.splice(index, 1)
                      setFieldValue('keywords', newKeywords)

                      const newKeywordErrors = keywordErrors.filter(
                        (keywordError) => keywordError !== keyword
                      )
                      setKeywordErrors(newKeywordErrors)
                    }}
                    color={
                      keywordErrors.includes(keyword) ? 'error' : 'primary'
                    }
                  />
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider textAlign="left">Images</Divider>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Button
                  onClick={() =>
                    handleGetPhoto(
                      values.robot,
                      setFieldValue,
                      setFieldError,
                      setFieldTouched
                    )
                  }
                  color="primary"
                  aria-label="detail"
                  size="medium"
                  title="Get photo"
                  startIcon={<AimOutlined style={{ fontSize: '2em' }} />}
                >
                  Get photo
                </Button>
              </Stack>
            </Grid>
            {values.photo && (
              <Grid
                item
                xs={4}
                container
                direction="column"
                alignItems="center"
              >
                <Stack spacing={1}>
                  <CardMedia
                    component="img"
                    title="Photo"
                    sx={{
                      maxWidth: '500px',
                      maxHeight: '500px',
                      border: '1px solid',
                    }}
                    image={`data:image/png;base64,${values.photo}`}
                    alt="Image"
                  />
                </Stack>
              </Grid>
            )}
            {values.contour && (
              <Grid
                item
                xs={4}
                container
                direction="column"
                alignItems="center"
              >
                <Stack spacing={1}>
                  <CardMedia
                    component="img"
                    title="Contour"
                    sx={{
                      maxWidth: '500px',
                      maxHeight: '500px',
                      border: '1px solid',
                    }}
                    image={`data:image/png;base64,${values.contour}`}
                    alt="Image"
                  />
                </Stack>
              </Grid>
            )}
            {values.shape && (
              <Grid
                item
                xs={4}
                container
                direction="column"
                alignItems="center"
              >
                <Stack spacing={1}>
                  <CardMedia
                    component="img"
                    title="Shape"
                    sx={{
                      maxWidth: '500px',
                      maxHeight: '500px',
                      border: '1px solid',
                    }}
                    image={`data:image/png;base64,${values.shape}`}
                    alt="Image"
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
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  )
}
