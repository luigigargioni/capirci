import { Autocomplete, FormHelperText, TextField } from '@mui/material'
import { VeterinarianType } from 'pages/veterinari/types'
import React, { useEffect, useState } from 'react'
import { endpoints } from 'services/endpoints'
import useSWR from 'swr'
import { minCharsAutocomplete, timerTimeoutAutocomplete } from 'utils/constants'
import { styleAutocomplete } from './types'

interface AutocompleteVeterinarianProps {
  disabled?: boolean
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void
  touched: any
  errors: any
  valuesVeterinarianId: number
  initialDataVeterinarianId: number | undefined
  setVeterinariansDataExt?: (veterinariansData: VeterinarianType[]) => void
}

export const AutocompleteVeterinarian = ({
  disabled,
  setFieldValue,
  touched,
  errors,
  initialDataVeterinarianId,
  valuesVeterinarianId,
  setVeterinariansDataExt,
}: AutocompleteVeterinarianProps) => {
  const [veterinariansData, setVeterinariansData] = useState<
    VeterinarianType[]
  >([])
  const [searchTimerVeterinarian, setSearchTimerVeterinarian] =
    useState<any>(null)
  const [veterinarianFilter, setVeterinarianFilter] = useState<string>('')
  const [forceLoadingVeterinarian, setForceLoadingVeterinarian] =
    useState<boolean>(false)

  const {
    data: reservationVeterinarianData,
    isLoading: reservationVeterinarianIsLoading,
  } = useSWR<VeterinarianType, Error>(
    initialDataVeterinarianId
      ? {
          mod: endpoints.veterinarian.get.mod,
          fnz: endpoints.veterinarian.get.fnz,
          body: {
            id: initialDataVeterinarianId,
          },
        }
      : null
  )

  // Retrieve veterinarian data from reservation
  useEffect(() => {
    if (!reservationVeterinarianIsLoading && reservationVeterinarianData) {
      setVeterinariansData([reservationVeterinarianData])
      if (setVeterinariansDataExt)
        setVeterinariansDataExt([reservationVeterinarianData])
    }
  }, [reservationVeterinarianData, reservationVeterinarianIsLoading])

  // Retrieve veterinarians list from search
  const {
    data: fetchedVeterinariansData,
    isLoading: isLoadingVeterinariansData,
  } = useSWR<{ records: VeterinarianType[]; total: number }, Error>(
    veterinarianFilter
      ? {
          mod: endpoints.veterinarian.list.mod,
          fnz: endpoints.veterinarian.list.fnz,
          body: {
            limit: 100,
            page: 1,
            search: veterinarianFilter,
          },
        }
      : null
  )

  useEffect(() => {
    if (!isLoadingVeterinariansData && fetchedVeterinariansData) {
      setVeterinariansData(fetchedVeterinariansData.records)
      if (setVeterinariansDataExt)
        setVeterinariansDataExt(fetchedVeterinariansData.records)
    }
    setForceLoadingVeterinarian(false)
  }, [isLoadingVeterinariansData, fetchedVeterinariansData])

  return (
    <>
      <Autocomplete
        id="veterinarian_id"
        disabled={disabled}
        onChange={(_event, value: any) =>
          setFieldValue('veterinarian_id', value?.id || null)
        }
        getOptionLabel={(option: any) =>
          `${option.company}, ${option.first_name} ${option.last_name}`
        }
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.company}, {option.first_name} {option.last_name}
            </li>
          )
        }}
        value={
          veterinariansData.find(
            (veterinarian) => veterinarian.id === valuesVeterinarianId
          ) || null
        }
        freeSolo
        onInputChange={(_e, v) => {
          const value = v.split(',')[0].trim()
          clearTimeout(searchTimerVeterinarian)
          if (value.length > minCharsAutocomplete)
            setForceLoadingVeterinarian(true)
          const timer = setTimeout(() => {
            if (value.length > minCharsAutocomplete)
              setVeterinarianFilter(value)
            if (value.length === 0) {
              setVeterinarianFilter('')
              setVeterinariansData([])
              if (setVeterinariansDataExt) setVeterinariansDataExt([])
            }
          }, timerTimeoutAutocomplete)
          setSearchTimerVeterinarian(timer)
        }}
        loading={
          reservationVeterinarianIsLoading ||
          isLoadingVeterinariansData ||
          forceLoadingVeterinarian
        }
        noOptionsText="Nessun veterinario trovato"
        loadingText="Caricamento..."
        options={veterinariansData}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Veterinario"
            sx={styleAutocomplete}
            error={Boolean(touched.veterinarian_id && errors.veterinarian_id)}
          />
        )}
      />
      {touched.veterinarian_id && errors.veterinarian_id && (
        <FormHelperText error id="helper-text-veterinarian_id">
          {errors.veterinarian_id}
        </FormHelperText>
      )}
    </>
  )
}

AutocompleteVeterinarian.defaultProps = {
  disabled: false,
  setVeterinariansDataExt: null,
}
