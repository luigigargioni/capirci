import React, { ReactNode } from 'react'
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons'
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
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material'
import { Collapse, Popconfirm } from 'antd'
import {
  AnimaleSizeArray,
  AnimaleStanzaTypes,
  AnimaleTypeArray,
} from 'pages/animali/types'
import { iconMap } from 'utils/iconMap'
import { useNavigate } from 'react-router-dom'
import { fetchApi, MethodHTTP, SERVER_API } from 'services/api'
import { Palette } from 'themes/palette'
import { endpoints } from 'services/endpoints'
import { MessageText } from 'utils/messages'
import { toast } from 'react-toastify'
import { formatDateBackend } from 'utils/date'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { FormikErrors } from 'formik'
import {
  AnimalePrestazioniType,
  DettaglioPrenotazioneType,
  GroomingServicesType,
} from './types'

interface ListPetsProps {
  pet: AnimalePrestazioniType
  index: number
  groomingData: GroomingServicesType[]
  setFieldValue: (field: string, value: any) => void
  prenotazioneData: DettaglioPrenotazioneType | undefined
  values: DettaglioPrenotazioneType
  errors: FormikErrors<DettaglioPrenotazioneType>
  isHistory: boolean
  isCheckin: boolean
  insertMode: boolean
  isSubmitting: boolean
  handleBlur: (e: React.FocusEvent<any>) => void
  handleChange: (e: React.ChangeEvent<any> | SelectChangeEvent<any>) => void
}

const handleDownloadGuestModule = (url: string) => {
  const fullPath = `${SERVER_API}/${url}`
  window.open(fullPath, '_blank', 'noopener,noreferrer')
}

const petHasErrors = (errors: any, index: number) =>
  Object.keys(errors).find((key) => key.split('.')[0] === `pets[${index}]`)

export const PetCollapse = ({
  pet,
  index,
  groomingData,
  setFieldValue,
  prenotazioneData,
  values,
  errors,
  isHistory,
  handleBlur,
  handleChange,
  isCheckin,
  insertMode,
  isSubmitting,
}: ListPetsProps) => {
  const themePalette = Palette('light')
  const navigate = useNavigate()

  const handleDeletePet = (petId: number) => {
    fetchApi({
      mod: endpoints.reservation.deletePet.mod,
      fnz: endpoints.reservation.deletePet.fnz,
      body: { id: prenotazioneData?.id, pet_id: petId },
      methodApi: MethodHTTP.POST,
    }).then((res) => {
      if (res?.bool) {
        toast.success(MessageText.success)
        setFieldValue(
          'pets',
          prenotazioneData?.pets.filter((item) => item.id !== petId)
        )
        return
      }
      toast.error(MessageText.serverError)
    })
  }

  return (
    <Collapse
      key={pet.id}
      style={{
        border: petHasErrors(errors, index)
          ? `1px solid ${themePalette.palette.error.main}`
          : '',
      }}
    >
      <Collapse.Panel
        header={pet.name}
        key={pet.id}
        style={{
          background: 'white',
          borderRadius: '8px',
        }}
        extra={
          !isHistory &&
          !insertMode && (
            <>
              <DownloadOutlined
                style={{
                  marginRight: '1rem',
                  color: themePalette.palette.primary.main,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(pet.url)
                }}
              />
              <Popconfirm
                title="Eliminare?"
                onConfirm={(e) => {
                  if (e) e.stopPropagation()
                  handleDeletePet(pet.id)
                }}
                okText="Ok"
                cancelText="Annulla"
                icon={iconMap.deleteCircle}
              >
                <DeleteOutlined
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    color: themePalette.palette.error.main,
                  }}
                />
              </Popconfirm>
            </>
          )
        }
      >
        <Grid container spacing={3} columns={{ xs: 1, sm: 6, md: 12 }}>
          <Grid item xs={1}>
            <Stack spacing={1}>
              <Button
                onClick={() => navigate(`/animale/${values.pets[index].id}`)}
                color="primary"
                aria-label="detail"
                size="medium"
                title="Dettaglio animale"
                startIcon={<EyeOutlined style={{ fontSize: '2em' }} />}
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
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={isHistory || insertMode}
              />
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <FormControl fullWidth>
                <InputLabel id="pet-type-label">Tipo</InputLabel>
                <Select
                  labelId="pet-type-label"
                  id={`pets[${index}].type`}
                  value={values.pets[index].type || ''}
                  label="Tipo"
                  name={`pets[${index}].type`}
                  disabled
                >
                  {AnimaleTypeArray.map(
                    (item: { value: string; label: string }) => (
                      <MenuItem value={item.value} key={item.value}>
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
                <InputLabel id="pet-sex-label">Sesso</InputLabel>
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
                <InputLabel id="pet-size-label">Taglia</InputLabel>
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
              <FormControl fullWidth>
                <InputLabel id="pet-room-label">Stanza</InputLabel>
                <Select
                  labelId="pet-room-label"
                  id={`pets[${index}].room`}
                  value={values.pets[index].room || ''}
                  label="Stanza"
                  name={`pets[${index}].room`}
                  onChange={
                    handleChange as (
                      event: SelectChangeEvent<string>,
                      child: ReactNode
                    ) => void
                  }
                  disabled={isHistory}
                  error={Boolean(errors[`pets[${index}].room`])}
                >
                  {AnimaleStanzaTypes.map((item) => (
                    <MenuItem value={item} key={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
                {errors[`pets[${index}].room`] && (
                  <FormHelperText error id="helper-text-pets-room">
                    {errors[`pets[${index}].room`]}
                  </FormHelperText>
                )}
              </FormControl>
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
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={isHistory}
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
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={isHistory}
              />
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <DatePicker
                value={dayjs(values.pets[index].birth_date || null)}
                label="Data nascita"
                disabled={isHistory}
                onChange={(value) =>
                  setFieldValue(
                    `pets[${index}].birth_date`,
                    formatDateBackend(value)
                  )
                }
                slotProps={{
                  textField: {
                    id: `pets[${index}].birth_date`,
                    name: `pets[${index}].birth_date`,
                    onBlur: handleBlur,
                    error: Boolean(errors[`pets[${index}].birth_date`]),
                  },
                }}
              />
              {errors[`pets[${index}].birth_date`] && (
                <FormHelperText error id="helper-text-pets-birth_date">
                  {errors[`pets[${index}].birth_date`]}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item xs={10}>
            <Stack spacing={1}>
              <TextField
                id={`pets[${index}].feeding`}
                value={values.pets[index].feeding || ''}
                title={values.pets[index].feeding}
                name={`pets[${index}].feeding`}
                label="Alimentazione"
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={isHistory}
                inputProps={{
                  maxLength: 200,
                }}
                error={Boolean(errors[`pets[${index}].feeding`])}
              />
              {errors[`pets[${index}].feeding`] && (
                <FormHelperText error id="helper-text-pets-feeding">
                  {errors[`pets[${index}].feeding`]}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <TextField
                id={`pets[${index}].allergies`}
                value={values.pets[index].allergies || ''}
                title={values.pets[index].allergies}
                name={`pets[${index}].allergies`}
                label="Allergie"
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={isHistory}
                inputProps={{
                  maxLength: 200,
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack spacing={1}>
              <TextField
                id={`pets[${index}].drugs`}
                value={values.pets[index].drugs || ''}
                title={values.pets[index].drugs}
                name={`pets[${index}].drugs`}
                label="Medicinali"
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={isHistory}
                inputProps={{
                  maxLength: 200,
                }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <TextField
                id={`pets[${index}].microchip`}
                value={values.pets[index].microchip || ''}
                title={values.pets[index].microchip}
                name={`pets[${index}].microchip`}
                label="Microchip"
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={isHistory}
                error={Boolean(errors[`pets[${index}].microchip`])}
              />
              {errors[`pets[${index}].microchip`] && (
                <FormHelperText error id="helper-text-pets-microchip">
                  {errors[`pets[${index}].microchip`]}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          {isCheckin && (
            <Grid item xs={12}>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                variant="outlined"
                color="primary"
                onClick={() =>
                  handleDownloadGuestModule(
                    prenotazioneData?.pets[index].url || ''
                  )
                }
              >
                Scarica scheda ospite
              </Button>
            </Grid>
          )}
          <Grid item xs={12}>
            <Divider textAlign="left">Servizi</Divider>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    id={`pets[${index}].webcam`}
                    value={values.pets[index].webcam}
                    name={`pets[${index}].webcam`}
                    onBlur={handleBlur}
                    disabled={isHistory}
                    onChange={(e) =>
                      setFieldValue(
                        `pets[${index}].webcam`,
                        e.target.checked ? 1 : 0
                      )
                    }
                    checked={values.pets[index].webcam === 1}
                  />
                }
                label="Webcam"
              />
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <FormControl fullWidth>
                <InputLabel id="pet-medicines-label">Medicinali</InputLabel>
                <Select
                  labelId="pet-medicines-label"
                  id={`pets[${index}].medicines`}
                  value={values.pets[index].medicines || '0'}
                  label="Medicinali"
                  name={`pets[${index}].medicines`}
                  disabled={isHistory}
                  onChange={handleChange}
                >
                  <MenuItem value="0">No</MenuItem>
                  <MenuItem value="1">Fino a 2 pastiglie al giorno</MenuItem>
                  <MenuItem value="2">Più pastiglie o iniezioni</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <TextField
                id={`pets[${index}].photo`}
                value={values.pets[index].photo || 0}
                name={`pets[${index}].photo`}
                label="Fotografie"
                disabled={isHistory}
                type="number"
                inputProps={{ min: 0, max: 99 }}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <TextField
                id={`pets[${index}].video`}
                value={values.pets[index].video || 0}
                name={`pets[${index}].video`}
                label="Video"
                disabled={isHistory}
                type="number"
                inputProps={{ min: 0, max: 99 }}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <TextField
                id={`pets[${index}].walk30`}
                value={values.pets[index].walk30 || 0}
                name={`pets[${index}].walk30`}
                label="Passeggiate 30 minuti"
                type="number"
                inputProps={{ min: 0, max: 99 }}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={isHistory}
              />
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack spacing={1}>
              <TextField
                id={`pets[${index}].walk60`}
                value={values.pets[index].walk60 || 0}
                name={`pets[${index}].walk60`}
                label="Passeggiate 60 minuti"
                type="number"
                inputProps={{ min: 0, max: 99 }}
                onBlur={handleBlur}
                onChange={handleChange}
                disabled={isHistory}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Divider textAlign="left">Toelettatura</Divider>
          </Grid>
          {groomingData
            .filter((item) => {
              if (values.pets[index].type === 'cane') {
                return item.class.includes('dog')
              }
              if (values.pets[index].type === 'gatto') {
                return item.class.includes('cat')
              }
              return false
            })
            .sort((a, b) => a.id - b.id)
            .map((item) => (
              <Grid item xs={3} key={item.id}>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        id={`pets[${index}].${item.key}`}
                        value={values.pets[index][item.key]}
                        name={`pets[${index}].${item.key}`}
                        disabled={isHistory}
                        onBlur={handleBlur}
                        onChange={(e) =>
                          setFieldValue(
                            `pets[${index}][${item.key}]`,
                            e.target.checked ? 1 : 0
                          )
                        }
                        checked={values.pets[index][item.key] === 1}
                      />
                    }
                    label={item.label}
                  />
                </Stack>
              </Grid>
            ))}
        </Grid>
      </Collapse.Panel>
    </Collapse>
  )
}
