import React from 'react'
import {
  Button,
  Divider,
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
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { AutocompleteCustomer } from 'pages/prenotazioni/autocompleteCustomer'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { formatDateBackend } from 'utils/date'

interface FormAnimaleProps {
  data: AnimaleType | undefined
  insertMode: boolean
  backFunction: () => void
}

export const FormAnimale = ({
  data,
  insertMode,
  backFunction,
}: FormAnimaleProps) => {
  const navigate = useNavigate()

  const onSubmit = async (
    values: AnimaleType,
    { setStatus, setSubmitting }
  ) => {
    fetchApi({
      mod: insertMode ? endpoints.pet.add.mod : endpoints.pet.update.mod,
      fnz: insertMode ? endpoints.pet.add.fnz : endpoints.pet.update.fnz,
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
        name: data?.name || '',
        sex: data?.sex || '',
        type: data?.type || '',
        breed: data?.breed || '',
        size: data?.size || '',
        microchip: data?.microchip || '',
        note: data?.note || '',
        private_note: data?.private_note || '',
        customer_id: data?.customer_id || -1,
        first_name: data?.first_name || '',
        last_name: data?.last_name || '',
        date_update: data?.date_update || '',
        birth_date: data?.birth_date || '',
        feeding: data?.feeding || '',
        allergies: data?.allergies || '',
        drugs: data?.drugs || '',
      }}
      validationSchema={YupObject().shape({
        name: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        sex: YupString().required(MessageText.requiredField),
        type: YupString().required(MessageText.requiredField),
        size: YupString().required(MessageText.requiredField),
        breed: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        customer_id: YupNumber()
          .min(1, MessageText.requiredField)
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
            <Grid item xs={12}>
              <Divider textAlign="left">Animale</Divider>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="name"
                  value={values.name || ''}
                  name="name"
                  label="Nome"
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
            <Grid item xs={2}>
              <Stack spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="pet-type-label">Tipo</InputLabel>
                  <Select
                    labelId="pet-type-label"
                    id="type"
                    value={values.type || ''}
                    label="Tipo"
                    name="type"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.type && errors.type)}
                  >
                    {AnimaleTypeArray.map(
                      (item: { value: string; label: string }) => (
                        <MenuItem value={item.value} key={item.value}>
                          {item.label}
                        </MenuItem>
                      )
                    )}
                  </Select>
                  {touched.type && errors.type && (
                    <FormHelperText error id="helper-text-type">
                      {errors.type}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={1}>
              <Stack spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="pet-sex-label">Sesso</InputLabel>
                  <Select
                    labelId="pet-sex-label"
                    id="sex"
                    value={values.sex || ''}
                    label="Sesso"
                    name="sex"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.sex && errors.sex)}
                  >
                    <MenuItem value="M">Maschio</MenuItem>
                    <MenuItem value="F">Femmina</MenuItem>
                  </Select>
                  {touched.sex && errors.sex && (
                    <FormHelperText error id="helper-text-sex">
                      {errors.sex}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <TextField
                  id="breed"
                  value={values.breed || ''}
                  name="breed"
                  label="Razza"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={Boolean(touched.breed && errors.breed)}
                />
                {touched.breed && errors.breed && (
                  <FormHelperText error id="helper-text-breed">
                    {errors.breed}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="pet-size-label">Taglia</InputLabel>
                  <Select
                    labelId="pet-size-label"
                    id="size"
                    value={values.size || ''}
                    label="Taglia"
                    name="size"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.size && errors.size)}
                  >
                    {AnimaleSizeArray.map((item) => (
                      <MenuItem value={item} key={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.size && errors.size && (
                    <FormHelperText error id="helper-text-size">
                      {errors.size}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <TextField
                  id="microchip"
                  value={values.microchip || ''}
                  name="microchip"
                  label="Microchip"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <TextField
                  id="note"
                  value={values.note || ''}
                  name="note"
                  label="Note"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <TextField
                  id="private_note"
                  value={values.private_note || ''}
                  name="private_note"
                  label="Note private"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <DatePicker
                  value={dayjs(values.birth_date || null)}
                  label="Data nascita"
                  onChange={(value) =>
                    setFieldValue('birth_date', formatDateBackend(value))
                  }
                  slotProps={{
                    textField: {
                      id: 'birth_date',
                      name: 'birth_date',
                      onBlur: handleBlur,
                      error: false,
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={10}>
              <Stack spacing={1}>
                <TextField
                  id="feeding"
                  value={values.feeding || ''}
                  name="feeding"
                  label="Alimentazione"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 200,
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <TextField
                  id="allergies"
                  value={values.allergies || ''}
                  name="allergies"
                  label="Allergie"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 200,
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <TextField
                  id="drugs"
                  value={values.drugs || ''}
                  name="drugs"
                  label="Medicinali"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{
                    maxLength: 200,
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider textAlign="left">Cliente</Divider>
            </Grid>
            <Grid item xs={1}>
              <Stack spacing={1}>
                <Button
                  onClick={() => navigate(`/cliente/${values.customer_id}`)}
                  color="primary"
                  aria-label="detail"
                  size="medium"
                  title="Dettaglio cliente"
                  startIcon={<EyeOutlined style={{ fontSize: '2em' }} />}
                  disabled={!values.customer_id || values.customer_id === -1}
                >
                  Dettaglio
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={11}>
              <Stack spacing={1}>
                <AutocompleteCustomer
                  setFieldValue={setFieldValue}
                  touched={touched}
                  errors={errors}
                  initialDataCustomerId={data?.customer_id}
                  valuesCustomerId={values.customer_id}
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
                Salva
              </Button>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  )
}
