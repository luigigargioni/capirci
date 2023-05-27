import React, { useState } from 'react'
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
import { DatePicker } from '@mui/x-date-pickers'
import { string as YupString, object as YupObject } from 'yup'

import { ClienteType, DocTypeEnum, FormClienteType } from 'pages/clienti/types'
import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { dateRegex, formatDateBackend } from 'utils/date'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Collapse } from 'antd'
import { AnimaleSizeArray, AnimaleTypeArray } from 'pages/animali/types'
import dayjs from 'dayjs'
import { AutocompleteVeterinarian } from 'pages/prenotazioni/autocompleteVeterinarian'
import { VeterinarianType } from 'pages/veterinari/types'

interface FormClienteProps {
  data: FormClienteType | undefined
  insertMode: boolean
  backFunction: () => void
}

export const FormCliente = ({
  data,
  insertMode,
  backFunction,
}: FormClienteProps) => {
  const navigate = useNavigate()
  const [veterinariansData, setVeterinariansData] = useState<
    VeterinarianType[]
  >([])
  const fiscalCodeRegex =
    /^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$|([0-9]{11})$/

  const onSubmit = async (
    values: ClienteType,
    { setStatus, setSubmitting }
  ) => {
    fetchApi({
      mod: insertMode
        ? endpoints.customer.add.mod
        : endpoints.customer.update.mod,
      fnz: insertMode
        ? endpoints.customer.add.fnz
        : endpoints.customer.update.fnz,
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
        first_name: data?.first_name || '',
        last_name: data?.last_name || '',
        fiscal_code: data?.fiscal_code || '',
        sex: data?.sex || '',
        birth_date: data?.birth_date || '',
        birth_city: data?.birth_city || '',
        birth_state: data?.birth_state || '',
        zip: data?.zip || '',
        state: data?.state || '',
        address: data?.address || '',
        city: data?.city || '',
        phone: data?.phone || '',
        email: data?.email || '',
        doc_type: data?.doc_type || '',
        doc_code: data?.doc_code || '',
        veterinarian_id: data?.veterinarian_id || -1,
        pets: data?.pets || [],
      }}
      validationSchema={YupObject().shape({
        first_name: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        last_name: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        fiscal_code: YupString()
          .max(16, MessageTextMaxLength(16))
          .matches(fiscalCodeRegex, MessageText.valueNotValid)
          .required(MessageText.requiredField),
        sex: YupString().required(MessageText.requiredField),
        email: YupString()
          .email(MessageText.emailNotValid)
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        birth_date: YupString()
          .max(10, MessageTextMaxLength(10))
          .matches(dateRegex, MessageText.valueNotValid)
          .required(MessageText.requiredField),
        birth_city: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        birth_state: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        zip: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        state: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        address: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        city: YupString()
          .max(255, MessageTextMaxLength(255))
          .required(MessageText.requiredField),
        doc_type: YupString().required(MessageText.requiredField),
        doc_code: YupString()
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
      }) => {
        const selectedVeterinarian = veterinariansData.find(
          (veterinarian) => veterinarian.id === values.veterinarian_id
        )
        return (
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
                    id="fiscal_code"
                    value={values.fiscal_code.toUpperCase() || ''}
                    name="fiscal_code"
                    label="Codice fiscale"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      const value = e.target.value || ''
                      setFieldValue('fiscal_code', value.toUpperCase())
                    }}
                    error={Boolean(touched.fiscal_code && errors.fiscal_code)}
                    inputProps={{
                      maxLength: 16,
                    }}
                  />
                  {touched.fiscal_code && errors.fiscal_code && (
                    <FormHelperText error id="helper-text-fiscal_code">
                      {errors.fiscal_code}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={1}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <InputLabel id="sex-label">Sesso</InputLabel>
                    <Select
                      labelId="sex-label"
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
              <Grid item xs={3}>
                <Stack spacing={2}>
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
                  <DatePicker
                    value={dayjs(values.birth_date)}
                    label="Data di nascita"
                    onChange={(value) =>
                      setFieldValue('birth_date', formatDateBackend(value))
                    }
                    slotProps={{
                      textField: {
                        id: 'birth_date',
                        name: 'birth_date',
                        onBlur: handleBlur,
                        error: Boolean(touched.birth_date && errors.birth_date),
                      },
                    }}
                  />
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack spacing={1}>
                  <TextField
                    id="birth_city"
                    value={values.birth_city || ''}
                    name="birth_city"
                    label="Città di nascita"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.birth_city && errors.birth_city)}
                  />
                  {touched.birth_city && errors.birth_city && (
                    <FormHelperText error id="helper-text-birth_city">
                      {errors.birth_city}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                  <TextField
                    id="birth_state"
                    value={values.birth_state || ''}
                    name="birth_state"
                    label="Provincia di nascita"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.birth_state && errors.birth_state)}
                    inputProps={{
                      maxLength: 2,
                    }}
                  />
                  {touched.birth_state && errors.birth_state && (
                    <FormHelperText error id="helper-text-birth_state">
                      {errors.birth_state}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                  <FormControl fullWidth>
                    <InputLabel id="doc_type-label">Tipo documento</InputLabel>
                    <Select
                      labelId="doc_type-label"
                      id="doc_type"
                      value={values.doc_type || ''}
                      label="Tipo documento"
                      name="doc_type"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.doc_type && errors.doc_type)}
                    >
                      <MenuItem value={DocTypeEnum.CARTAIDENTITA.value}>
                        {DocTypeEnum.CARTAIDENTITA.label}
                      </MenuItem>
                      <MenuItem value={DocTypeEnum.PATENTE.value}>
                        {DocTypeEnum.PATENTE.label}
                      </MenuItem>
                      <MenuItem value={DocTypeEnum.PASSAPORTO.value}>
                        {DocTypeEnum.PASSAPORTO.label}
                      </MenuItem>
                    </Select>
                    {touched.doc_type && errors.doc_type && (
                      <FormHelperText error id="helper-text-doc_type">
                        {errors.doc_type}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack spacing={1}>
                  <TextField
                    id="doc_code"
                    value={values.doc_code || ''}
                    name="doc_code"
                    label="Documento numero"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.doc_code && errors.doc_code)}
                  />
                  {touched.doc_code && errors.doc_code && (
                    <FormHelperText error id="helper-text-doc_code">
                      {errors.doc_code}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack spacing={1}>
                  <TextField
                    id="city"
                    value={values.city || ''}
                    name="city"
                    label="Città di residenza"
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
              <Grid item xs={2}>
                <Stack spacing={1}>
                  <TextField
                    id="state"
                    value={values.state || ''}
                    name="state"
                    label="Provincia di residenza"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.state && errors.state)}
                    inputProps={{
                      maxLength: 2,
                    }}
                  />
                  {touched.state && errors.state && (
                    <FormHelperText error id="helper-text-state">
                      {errors.state}
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
                    label="Indirizzo di residenza"
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
              <Grid item xs={3}>
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
              <Grid item xs={12}>
                <Divider textAlign="left">Animali</Divider>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  {values.pets.length === 0 && <p>Nessun animale</p>}
                  {values.pets.length > 0 &&
                    values.pets.map((pet, index) => (
                      <Collapse key={pet.id}>
                        <Collapse.Panel
                          header={pet.name}
                          key={pet.id}
                          style={{
                            background: 'white',
                            borderRadius: '8px',
                          }}
                        >
                          <Grid
                            container
                            spacing={3}
                            columns={{ xs: 1, sm: 6, md: 12 }}
                          >
                            <Grid item xs={1}>
                              <Stack spacing={1}>
                                <Button
                                  onClick={() =>
                                    navigate(
                                      `/animale/${values.pets[index].id}`
                                    )
                                  }
                                  color="primary"
                                  aria-label="detail"
                                  size="medium"
                                  title="Dettaglio animale"
                                  startIcon={
                                    <EyeOutlined style={{ fontSize: '2em' }} />
                                  }
                                >
                                  Dettaglio
                                </Button>
                              </Stack>
                            </Grid>
                            <Grid item xs={2}>
                              <Stack spacing={1}>
                                <TextField
                                  id={`pets[${index}].name`}
                                  value={values.pets[index].name || ''}
                                  title={values.pets[index].name}
                                  name={`pets[${index}].name`}
                                  label="Nome"
                                  disabled
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={2}>
                              <Stack spacing={1}>
                                <FormControl fullWidth>
                                  <InputLabel id="pet-type-label">
                                    Tipo
                                  </InputLabel>
                                  <Select
                                    labelId="pet-type-label"
                                    id={`pets[${index}].type`}
                                    value={values.pets[index].type || ''}
                                    label="Tipo"
                                    name={`pets[${index}].type`}
                                    disabled
                                  >
                                    {AnimaleTypeArray.map(
                                      (item: {
                                        value: string
                                        label: string
                                      }) => (
                                        <MenuItem
                                          value={item.value}
                                          key={item.value}
                                        >
                                          {item.label}
                                        </MenuItem>
                                      )
                                    )}
                                  </Select>
                                </FormControl>
                              </Stack>
                            </Grid>
                            <Grid item xs={1}>
                              <Stack spacing={1}>
                                <FormControl fullWidth>
                                  <InputLabel id="pet-sex-label">
                                    Sesso
                                  </InputLabel>
                                  <Select
                                    labelId="pet-sex-label"
                                    id={`pets[${index}].sex`}
                                    value={values.pets[index].sex || ''}
                                    label="Sesso"
                                    name={`pets[${index}].sex`}
                                    disabled
                                  >
                                    <MenuItem value="M">Maschio</MenuItem>
                                    <MenuItem value="F">Femmina</MenuItem>
                                  </Select>
                                </FormControl>
                              </Stack>
                            </Grid>
                            <Grid item xs={2}>
                              <Stack spacing={1}>
                                <TextField
                                  id={`pets[${index}].breed`}
                                  value={values.pets[index].breed || ''}
                                  name={`pets[${index}].breed`}
                                  label="Razza"
                                  disabled
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={2}>
                              <Stack spacing={1}>
                                <FormControl fullWidth>
                                  <InputLabel id="pet-size-label">
                                    Taglia
                                  </InputLabel>
                                  <Select
                                    labelId="pet-size-label"
                                    id={`pets[${index}].size`}
                                    value={values.pets[index].size || ''}
                                    label="Taglia"
                                    name={`pets[${index}].size`}
                                    disabled
                                  >
                                    {AnimaleSizeArray.map((item) => (
                                      <MenuItem value={item} key={item}>
                                        {item}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Stack>
                            </Grid>
                            <Grid item xs={2}>
                              <Stack spacing={1}>
                                <TextField
                                  id={`pets[${index}].microchip`}
                                  value={values.pets[index].microchip || ''}
                                  title={values.pets[index].microchip}
                                  name={`pets[${index}].microchip`}
                                  label="Microchip"
                                  disabled
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={6}>
                              <Stack spacing={1}>
                                <TextField
                                  id={`pets[${index}].note`}
                                  value={values.pets[index].note || ''}
                                  title={values.pets[index].note}
                                  name={`pets[${index}].note`}
                                  label="Note"
                                  disabled
                                />
                              </Stack>
                            </Grid>
                            <Grid item xs={6}>
                              <Stack spacing={1}>
                                <TextField
                                  id={`pets[${index}].private_note`}
                                  value={values.pets[index].private_note || ''}
                                  title={values.pets[index].private_note}
                                  name={`pets[${index}].private_note`}
                                  label="Note private"
                                  disabled
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                        </Collapse.Panel>
                      </Collapse>
                    ))}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Divider textAlign="left">Veterinario</Divider>
              </Grid>
              <Grid item xs={1}>
                <Stack spacing={1}>
                  <Button
                    onClick={() =>
                      navigate(`/veterinario/${values.veterinarian_id}`)
                    }
                    color="primary"
                    aria-label="detail"
                    size="medium"
                    title="Dettaglio veterinario"
                    startIcon={<EyeOutlined style={{ fontSize: '2em' }} />}
                    disabled={
                      !values.veterinarian_id || values.veterinarian_id === -1
                    }
                  >
                    Dettaglio
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack spacing={1}>
                  <AutocompleteVeterinarian
                    setFieldValue={setFieldValue}
                    touched={touched}
                    errors={errors}
                    valuesVeterinarianId={values.veterinarian_id}
                    initialDataVeterinarianId={data?.veterinarian_id}
                    setVeterinariansDataExt={setVeterinariansData}
                  />
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                  <TextField
                    id="veterinarian_email"
                    value={selectedVeterinarian?.email || ''}
                    name="veterinarian_email"
                    label="Email"
                    disabled
                  />
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                  <TextField
                    id="veterinarian_phone"
                    value={selectedVeterinarian?.phone || ''}
                    name="veterinarian_phone"
                    label="Telefono"
                    disabled
                  />
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                  <TextField
                    id="veterinarian_mobile"
                    value={selectedVeterinarian?.mobile || ''}
                    name="veterinarian_mobile"
                    label="Cellulare"
                    disabled
                  />
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack spacing={1}>
                  <TextField
                    id="veterinarian_emergency"
                    value={selectedVeterinarian?.emergency || ''}
                    name="veterinarian_emergency"
                    label="Urgenze"
                    disabled
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
        )
      }}
    </Formik>
  )
}
