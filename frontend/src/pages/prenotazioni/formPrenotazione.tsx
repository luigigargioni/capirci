import React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { DatePicker } from '@mui/x-date-pickers'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import {
  string as YupString,
  object as YupObject,
  number as YupNumber,
  array as YupArray,
} from 'yup'
import useSWR from 'swr'
import { Popconfirm } from 'antd'

import { fetchApi, MethodHTTP } from 'services/api'
import { endpoints } from 'services/endpoints'
import { MessageText, MessageTextMaxLength } from 'utils/messages'
import { dateRegex, formatDateBackend } from 'utils/date'
import {
  AnimalePrestazioniType,
  DettaglioPrenotazioneType,
  FormPrenotazioneType,
  GroomingServicesType,
  PaymentMethodType,
} from 'pages/prenotazioni/types'
import dayjs from 'dayjs'
import { iconMap } from 'utils/iconMap'
import { AnimaleType } from 'pages/tasks/types'
import { ServiceDeliveredListType } from 'pages/servizi/types'
import { downloadPdf } from 'utils'
import { PetCollapse } from './petCollapse'
import { AutocompleteCustomer } from './autocompleteCustomer'
import { AutocompleteVeterinarian } from './autocompleteVeterinarian'
import { ServiceDelivered } from './serviceDelivered'

interface FormPrenotazioneProps {
  prenotazioneData: FormPrenotazioneType | undefined
  groomingData: GroomingServicesType[]
  paymentMethodData: PaymentMethodType[]
  servicesDelivered: ServiceDeliveredListType[]
  isCheckin: boolean
  isCheckout: boolean
  isHistory: boolean
  isDetailCheckin: boolean
  insertMode: boolean
  backFunction: () => void
}

export const FormPrenotazione = ({
  prenotazioneData,
  groomingData,
  paymentMethodData,
  servicesDelivered,
  isCheckin,
  isCheckout,
  isHistory,
  isDetailCheckin,
  insertMode,
  backFunction,
}: FormPrenotazioneProps) => {
  const navigate = useNavigate()

  const [selectedCustomer, setSelectedCustomer] = React.useState<number | null>(
    prenotazioneData?.customer_id || null
  )
  const [servicesDeliveredState, setServicesDeliveredState] = React.useState<
    ServiceDeliveredListType[]
  >(servicesDelivered || [])

  const { data: dataPets } = useSWR<
    { records: AnimaleType[]; total: number },
    Error
  >(
    selectedCustomer
      ? {
          mod: endpoints.pet.list.mod,
          fnz: endpoints.pet.list.fnz,
          body: {
            limit: 100,
            page: 1,
            customer_id: selectedCustomer,
          },
        }
      : null
  )

  const checkoutSpecial = () => {
    fetchApi({
      mod: endpoints.reservation.checkOutSpecial.mod,
      fnz: endpoints.reservation.checkOutSpecial.fnz,
      body: { id: prenotazioneData?.id },
      methodApi: MethodHTTP.POST,
    }).then((response) => {
      if (response.bool) {
        toast.success(MessageText.success)
        backFunction()
        return
      }
      toast.error(MessageText.serverError)
    })
  }

  const handlePreBill = () => {
    fetchApi({
      mod: endpoints.reservation.pre_bill.mod,
      fnz: endpoints.reservation.pre_bill.fnz,
      body: { id: prenotazioneData?.id },
      methodApi: MethodHTTP.POST,
    }).then((res) => {
      if (res?.bool) {
        downloadPdf(res.data.b64, res.data.name)
        toast.success(MessageText.success)
        return
      }
      toast.error(MessageText.serverError)
    })
  }

  const onSubmit = async (
    values: DettaglioPrenotazioneType,
    { setStatus, setSubmitting, setFieldError }
  ) => {
    if (isCheckin) {
      let checkinErrors = false
      if (!values.veterinarian_id || values.veterinarian_id === -1) {
        setFieldError('veterinarian_id', MessageText.requiredField)
        checkinErrors = true
      }
      values.pets.forEach((pet: AnimalePrestazioniType, index) => {
        if (!pet.microchip) {
          setFieldError(
            `['pets[${index}].microchip']`,
            MessageText.requiredField
          )
          checkinErrors = true
        }
        if (!pet.feeding) {
          setFieldError(`['pets[${index}].feeding']`, MessageText.requiredField)
          checkinErrors = true
        }
        if (!pet.birth_date) {
          setFieldError(
            `['pets[${index}].birth_date']`,
            MessageText.requiredField
          )
          checkinErrors = true
        }
      })
      if (checkinErrors) return
    }

    if (insertMode) {
      let insertModeErrors = false
      values.pets.forEach((pet: AnimalePrestazioniType, index) => {
        if (!pet.room) {
          setFieldError(`['pets[${index}].room']`, MessageText.requiredField)
          insertModeErrors = true
        }
      })
      if (insertModeErrors) return
    }

    // Add or Update reservation
    const addOrUpdateReservation = fetchApi({
      mod: insertMode
        ? endpoints.reservation.add.mod
        : endpoints.reservation.update.mod,
      fnz: insertMode
        ? endpoints.reservation.add.fnz
        : endpoints.reservation.update.fnz,
      body: {
        ...values,
      },
      methodApi: MethodHTTP.POST,
    })

    // Update veterinarian
    const updateVeterinarian = !insertMode
      ? fetchApi({
          mod: endpoints.customer.setVeterinarian.mod,
          fnz: endpoints.customer.setVeterinarian.fnz,
          body: {
            id: values.customer_id,
            veterinarian_id: values.veterinarian_id,
          },
          methodApi: MethodHTTP.POST,
        })
      : null

    // Check-in
    const checkIn = isCheckin
      ? fetchApi({
          mod: endpoints.reservation.checkIn.mod,
          fnz: endpoints.reservation.checkIn.fnz,
          body: { id: values.id },
          methodApi: MethodHTTP.POST,
        })
      : null

    // Check-out
    const checkOut = isCheckout
      ? fetchApi({
          mod: endpoints.reservation.checkOut.mod,
          fnz: endpoints.reservation.checkOut.fnz,
          body: { id: values.id },
          methodApi: MethodHTTP.POST,
        })
      : null

    const allPromises = [
      addOrUpdateReservation,
      updateVeterinarian,
      checkIn,
      checkOut,
    ]

    const responses = await Promise.all(allPromises)

    if (
      // Check-in
      (responses[0]?.bool && // Add or update reservation
        responses[1]?.bool && // Update veterinarian
        responses[2]?.bool && // Check-in
        isCheckin &&
        !isCheckout &&
        !insertMode) ||
      // Check-out
      (responses[0]?.bool && // Add or update reservation
        responses[1]?.bool && // Update veterinarian
        responses[3]?.bool && // Check-out
        isCheckout &&
        !isCheckin &&
        !insertMode) ||
      // Edit reservation
      (responses[0]?.bool && // Add or update reservation
        responses[1]?.bool && // Update veterinarian
        !isCheckin &&
        !isCheckout &&
        !insertMode) ||
      // New reservation
      (responses[0]?.bool && // Add or update reservation
        !isCheckin &&
        !isCheckout &&
        insertMode)
    ) {
      toast.success(MessageText.success)
      setStatus({ success: true })
      if (insertMode) {
        navigate(`/prenotazione/${responses[0]?.id}?type=detailCheckin`)
        return
      }
      backFunction()
    } else {
      toast.error(MessageText.serverError)
      setStatus({ success: false })
    }
    setSubmitting(false)
  }

  return (
    <Formik
      initialValues={{
        id: prenotazioneData?.id || -1,
        customer_id: prenotazioneData?.customer_id || -1,
        date_from: prenotazioneData?.date_from || '',
        date_to: prenotazioneData?.date_to || '',
        note: prenotazioneData?.note || '',
        private_note: prenotazioneData?.private_note || '',
        date_add: prenotazioneData?.date_add || '',
        confirmed: prenotazioneData?.confirmed || 0,
        active: prenotazioneData?.active || 0,
        advance_payment_method_id:
          prenotazioneData?.advance_payment_method_id || '',
        advance_payment_date: prenotazioneData?.advance_payment_date || '',
        advance_payment_amount: prenotazioneData?.advance_payment_amount || 0,
        payment_method_id: prenotazioneData?.payment_method_id || '',
        payment_date: prenotazioneData?.payment_date || '',
        payment_amount: prenotazioneData?.payment_amount || 0,
        deleted: prenotazioneData?.deleted || 0,
        delete_date: prenotazioneData?.delete_date || '',
        delete_user: prenotazioneData?.delete_user || '',
        first_name: prenotazioneData?.first_name || '',
        last_name: prenotazioneData?.last_name || '',
        fiscal_code: prenotazioneData?.fiscal_code || '',
        sex: prenotazioneData?.sex || '',
        birth_date: prenotazioneData?.birth_date || '',
        birth_city: prenotazioneData?.birth_city || '',
        birth_state: prenotazioneData?.birth_state || '',
        zip: prenotazioneData?.zip || '',
        state: prenotazioneData?.state || '',
        address: prenotazioneData?.address || '',
        city: prenotazioneData?.city || '',
        phone: prenotazioneData?.phone || '',
        email: prenotazioneData?.email || '',
        doc_type: prenotazioneData?.doc_type || '',
        doc_code: prenotazioneData?.doc_code || '',
        veterinarian_id: prenotazioneData?.veterinarian_id || -1,
        pets: prenotazioneData?.pets || [],
        total_accomodation: prenotazioneData?.total_accomodation || 0,
        discount_advance_accomodation:
          prenotazioneData?.discount_advance_accomodation || 0,
      }}
      validationSchema={YupObject().shape({
        customer_id: YupNumber()
          .min(1, MessageText.requiredField)
          .required(MessageText.requiredField),
        date_from: YupString()
          .max(10, MessageTextMaxLength(10))
          .matches(dateRegex, MessageText.valueNotValid)
          .required(MessageText.requiredField),
        date_to: YupString()
          .max(10, MessageTextMaxLength(10))
          .matches(dateRegex, MessageText.valueNotValid)
          .required(MessageText.requiredField),
        pets: YupArray()
          .min(1, MessageText.requiredField)
          .required(MessageText.requiredField),
      })}
      onSubmit={onSubmit}
      enableReinitialize
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
            <Grid item xs={insertMode ? 11 : 5}>
              <Stack spacing={1}>
                <AutocompleteCustomer
                  disabled={!insertMode}
                  setFieldValue={setFieldValue}
                  setSelectedCustomer={setSelectedCustomer}
                  touched={touched}
                  errors={errors}
                  initialDataCustomerId={prenotazioneData?.customer_id}
                  valuesCustomerId={values.customer_id}
                />
              </Stack>
            </Grid>
            {!insertMode && (
              <>
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
                <Grid item xs={5}>
                  <Stack spacing={1}>
                    <AutocompleteVeterinarian
                      disabled={isHistory || insertMode}
                      setFieldValue={setFieldValue}
                      touched={touched}
                      errors={errors}
                      initialDataVeterinarianId={
                        prenotazioneData?.veterinarian_id
                      }
                      valuesVeterinarianId={values.veterinarian_id}
                    />
                  </Stack>
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Divider textAlign="left">Prenotazione</Divider>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <DatePicker
                  value={dayjs(values.date_from)}
                  label="Data da"
                  disabled={isHistory}
                  onChange={(value) =>
                    setFieldValue('date_from', formatDateBackend(value))
                  }
                  slotProps={{
                    textField: {
                      id: 'date_from',
                      name: 'date_from',
                      onBlur: handleBlur,
                      error: Boolean(touched.date_from && errors.date_from),
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <DatePicker
                  value={dayjs(values.date_to)}
                  label="Data a"
                  disabled={isHistory}
                  onChange={(value) =>
                    setFieldValue('date_to', formatDateBackend(value))
                  }
                  slotProps={{
                    textField: {
                      id: 'date_to',
                      name: 'date_to',
                      onBlur: handleBlur,
                      error: Boolean(touched.date_to && errors.date_to),
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={1}>
                <DatePicker
                  value={dayjs(values.date_add)}
                  label="Data inserimento"
                  disabled
                  onChange={(value) =>
                    setFieldValue('date_add', formatDateBackend(value))
                  }
                  slotProps={{
                    textField: {
                      id: 'date_add',
                      name: 'date_add',
                      onBlur: handleBlur,
                      error: Boolean(touched.date_add && errors.date_add),
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <TextField
                  id="note"
                  disabled={isHistory}
                  value={values.note || ''}
                  name="note"
                  label="Note"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  title={values.note}
                />
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <TextField
                  id="private_note"
                  disabled={isHistory}
                  value={values.private_note || ''}
                  name="private_note"
                  label="Note private"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  title={values.private_note}
                />
              </Stack>
            </Grid>
            <Grid item xs={1}>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="confirmed"
                      value={values.confirmed}
                      name="confirmed"
                      onBlur={handleBlur}
                      onChange={() =>
                        setFieldValue(
                          'confirmed',
                          values.confirmed === 1 ? 0 : 1
                        )
                      }
                      checked={values.confirmed === 1}
                      disabled
                    />
                  }
                  label="Confermata"
                />
              </Stack>
            </Grid>
            <Grid item xs={1}>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="active"
                      value={values.active}
                      name="active"
                      onBlur={handleBlur}
                      onChange={() =>
                        setFieldValue('active', values.active === 1 ? 0 : 1)
                      }
                      checked={values.active === 1}
                      disabled
                    />
                  }
                  label="Attiva"
                />
              </Stack>
            </Grid>
            <Grid item xs={1}>
              <Stack spacing={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="deleted"
                      value={values.deleted}
                      name="deleted"
                      disabled
                      onBlur={handleBlur}
                      onChange={() =>
                        setFieldValue('deleted', values.deleted === 1 ? 0 : 1)
                      }
                      checked={values.deleted === 1}
                    />
                  }
                  label="Eliminata"
                />
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <DatePicker
                  value={dayjs(values.delete_date)}
                  label="Data eliminazione"
                  disabled
                  onChange={(value) =>
                    setFieldValue('delete_date', formatDateBackend(value))
                  }
                  slotProps={{
                    textField: {
                      id: 'delete_date',
                      name: 'delete_date',
                      onBlur: handleBlur,
                      error: Boolean(touched.delete_date && errors.delete_date),
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <TextField
                  id="total_accomodation"
                  value={values.total_accomodation || 0}
                  name="total_accomodation"
                  label="Totale alloggio"
                  type="number"
                  inputProps={{ min: 0, max: 1000, step: 10, prefix: '€' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled
                />
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <TextField
                  id="discount_advance_accomodation"
                  value={values.discount_advance_accomodation || 0}
                  name="discount_advance_accomodation"
                  label="Sconto per caparra"
                  type="number"
                  inputProps={{ min: 0, max: 1000, step: 1, prefix: '€' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled
                />
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <DatePicker
                  value={dayjs(values.advance_payment_date)}
                  label="Data caparra"
                  disabled={isHistory}
                  onChange={(value) =>
                    setFieldValue(
                      'advance_payment_date',
                      formatDateBackend(value)
                    )
                  }
                  slotProps={{
                    textField: {
                      id: 'advance_payment_date',
                      name: 'advance_payment_date',
                      onBlur: handleBlur,
                      error: false,
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={1}>
                <TextField
                  id="advance_payment_amount"
                  disabled={isHistory}
                  value={values.advance_payment_amount || 0}
                  name="advance_payment_amount"
                  label="Importo caparra"
                  type="number"
                  inputProps={{ min: 0, max: 1000, step: 10, prefix: '€' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Stack>
            </Grid>
            <Grid item xs={5}>
              <Stack spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="advance-payment-method-id-label">
                    Metodo pagamento caparra
                  </InputLabel>
                  <Select
                    labelId="advance-payment-method-id-label"
                    id="advance_payment_method_id"
                    disabled={isHistory}
                    value={values.advance_payment_method_id || ''}
                    name="advance_payment_method_id"
                    label="Metodo pagamento caparra"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    title={values.advance_payment_method_id}
                  >
                    {paymentMethodData?.map((paymentMethod) => (
                      <MenuItem value={paymentMethod.id} key={paymentMethod.id}>
                        {paymentMethod.descr}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={3}>
              <Stack spacing={1}>
                <DatePicker
                  value={dayjs(values.payment_date)}
                  label="Data saldo"
                  disabled={isHistory}
                  onChange={(value) =>
                    setFieldValue('payment_date', formatDateBackend(value))
                  }
                  slotProps={{
                    textField: {
                      id: 'payment_date',
                      name: 'payment_date',
                      onBlur: handleBlur,
                      error: false,
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack spacing={1}>
                <TextField
                  id="payment_amount"
                  disabled={isHistory}
                  value={values.payment_amount || 0}
                  name="payment_amount"
                  label="Importo saldo"
                  type="number"
                  inputProps={{ min: 0, max: 1000, step: 10, prefix: '€' }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    ),
                  }}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Stack>
            </Grid>
            <Grid item xs={5}>
              <Stack spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="payment-method-id-label">
                    Metodo pagamento saldo
                  </InputLabel>
                  <Select
                    labelId="payment-method-id-label"
                    id="payment_method_id"
                    disabled={isHistory}
                    value={values.payment_method_id || ''}
                    name="payment_method_id"
                    label="Metodo pagamento saldo"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    title={values.payment_method_id}
                  >
                    {paymentMethodData?.map((paymentMethod) => (
                      <MenuItem value={paymentMethod.id} key={paymentMethod.id}>
                        {paymentMethod.descr}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Divider textAlign="left">Animali</Divider>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <FormControl fullWidth>
                  <InputLabel id="pets-label">Animali</InputLabel>
                  <Select
                    labelId="pets-label"
                    id="pets"
                    value={
                      // Nested loop to find the selected pets
                      dataPets?.records.filter((pet) => {
                        return values.pets?.find((selectedPet) => {
                          return selectedPet.id === pet.id
                        })
                      }) || []
                    }
                    label="Animali"
                    name="pets"
                    multiple
                    disabled={
                      !values.customer_id ||
                      values.customer_id === -1 ||
                      (!insertMode && !isCheckin && !isDetailCheckin)
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.pets && errors.pets)}
                  >
                    {dataPets?.records.map((pet) => (
                      <MenuItem value={pet as any} key={pet.id}>
                        {`${pet.name}: ${pet.type} (${pet.breed})`}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.pets && errors.pets && (
                    <FormHelperText error id="helper-text-pets">
                      {errors.pets as string}
                    </FormHelperText>
                  )}
                </FormControl>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                {values.pets.length === 0 && <p>Nessun animale</p>}
                {values.pets.length > 0 &&
                  values.pets.map((pet: AnimalePrestazioniType, index) => (
                    <PetCollapse
                      pet={pet}
                      index={index}
                      key={pet.id}
                      groomingData={groomingData}
                      setFieldValue={setFieldValue}
                      prenotazioneData={prenotazioneData}
                      values={values}
                      errors={errors}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      isHistory={isHistory}
                      isCheckin={isCheckin}
                      insertMode={insertMode}
                      isSubmitting={isSubmitting}
                    />
                  ))}
              </Stack>
            </Grid>
            {isCheckout && (
              <>
                <Grid item xs={12}>
                  <Divider textAlign="left">Servizi erogati</Divider>
                </Grid>
                {servicesDeliveredState.length === 0 && (
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <p>Nessun servizio erogato</p>
                    </Stack>
                  </Grid>
                )}
                {servicesDeliveredState.length > 0 &&
                  servicesDeliveredState.map(
                    (service: ServiceDeliveredListType) => (
                      <ServiceDelivered
                        key={service.id}
                        service={service}
                        servicesDeliveredState={servicesDeliveredState}
                        setServicesDeliveredState={setServicesDeliveredState}
                      />
                    )
                  )}
              </>
            )}
            {!isHistory && (
              <>
                <Grid item xs={isCheckout ? 8 : 12}>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {isCheckin && 'Check-in'}
                    {isCheckout && 'Check-out'}
                    {!isCheckin && !isCheckout && 'Salva'}
                  </Button>
                </Grid>
                {isCheckout && (
                  <>
                    <Grid item xs={2}>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        variant="outlined"
                        color="primary"
                        onClick={() => handlePreBill()}
                      >
                        Pre-Conto
                      </Button>
                    </Grid>
                    <Grid item xs={2}>
                      <Popconfirm
                        title="Confermare?"
                        onConfirm={() => checkoutSpecial()}
                        okText="Ok"
                        cancelText="Annulla"
                        icon={iconMap.successData}
                      >
                        <Button
                          disableElevation
                          disabled={
                            isSubmitting ||
                            (values.advance_payment_amount > 0 &&
                              values.advance_payment_method_id !== 'MP01')
                          }
                          fullWidth
                          size="large"
                          variant="contained"
                          color="warning"
                        >
                          Special
                        </Button>
                      </Popconfirm>
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>
        </form>
      )}
    </Formik>
  )
}
