import { Autocomplete, FormHelperText, TextField } from '@mui/material'
import { ClienteType } from 'pages/clienti/types'
import React, { useEffect, useState } from 'react'
import { endpoints } from 'services/endpoints'
import useSWR from 'swr'
import { minCharsAutocomplete, timerTimeoutAutocomplete } from 'utils/constants'
import { styleAutocomplete } from './types'

interface AutocompleteCustomerProps {
  disabled?: boolean
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void
  setSelectedCustomer?: ((id: number) => void) | null
  touched: any
  errors: any
  initialDataCustomerId: number | undefined
  valuesCustomerId: number
}

export const AutocompleteCustomer = ({
  disabled,
  setFieldValue,
  setSelectedCustomer,
  touched,
  errors,
  initialDataCustomerId,
  valuesCustomerId,
}: AutocompleteCustomerProps) => {
  const [customersData, setCustomersData] = useState<ClienteType[]>([])
  const [searchTimerCustomer, setSearchTimerCustomer] = useState<any>(null)
  const [customerFilter, setCustomerFilter] = useState<string>('')
  const [forceLoadingCustomer, setForceLoadingCustomer] =
    useState<boolean>(false)

  // Retrieve customers list from search
  const { data: fetchedCustomersData, isLoading: isLoadingCustomersData } =
    useSWR<{ records: ClienteType[]; total: number }, Error>(
      customerFilter
        ? {
            mod: endpoints.customer.list.mod,
            fnz: endpoints.customer.list.fnz,
            body: {
              limit: 100,
              page: 1,
              search: customerFilter,
            },
          }
        : null
    )
  useEffect(() => {
    if (!isLoadingCustomersData && fetchedCustomersData) {
      setCustomersData(fetchedCustomersData.records)
    }
    setForceLoadingCustomer(false)
  }, [isLoadingCustomersData, fetchedCustomersData])

  const {
    data: reservationCustomerData,
    isLoading: reservationCustomerIsLoading,
  } = useSWR<ClienteType, Error>(
    initialDataCustomerId
      ? {
          mod: endpoints.customer.get.mod,
          fnz: endpoints.customer.get.fnz,
          body: {
            id: initialDataCustomerId,
          },
        }
      : null
  )

  // Retrieve customer data from reservation
  useEffect(() => {
    if (!reservationCustomerIsLoading && reservationCustomerData) {
      setCustomersData([reservationCustomerData])
    }
  }, [reservationCustomerData, reservationCustomerIsLoading])

  return (
    <>
      <Autocomplete
        id="customer_id"
        disabled={disabled}
        onChange={(_event, value: any) => {
          setFieldValue('customer_id', value?.id || null)
          if (setSelectedCustomer) setSelectedCustomer(value?.id as number)
        }}
        getOptionLabel={(option: any) =>
          `${option.first_name} ${option.last_name}`
        }
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.first_name} {option.last_name}
            </li>
          )
        }}
        value={
          customersData.find((customer) => customer.id === valuesCustomerId) ||
          null
        }
        freeSolo
        onInputChange={(_e, v) => {
          const value = v.split(',')[0].trim()
          clearTimeout(searchTimerCustomer)
          if (value.length > minCharsAutocomplete) setForceLoadingCustomer(true)
          const timer = setTimeout(() => {
            if (value.length > minCharsAutocomplete) setCustomerFilter(value)
            if (value.length === 0) {
              setCustomerFilter('')
              setCustomersData([])
            }
          }, timerTimeoutAutocomplete)
          setSearchTimerCustomer(timer)
        }}
        loading={isLoadingCustomersData || forceLoadingCustomer}
        noOptionsText="Nessun cliente trovato"
        loadingText="Caricamento..."
        options={customersData}
        renderInput={(params) => (
          <TextField
            {...params}
            error={Boolean(touched.customer_id && errors.customer_id)}
            label="Nome e cognome"
            sx={styleAutocomplete}
          />
        )}
      />
      {touched.customer_id && errors.customer_id && (
        <FormHelperText error id="helper-text-customer_id">
          {errors.customer_id}
        </FormHelperText>
      )}
    </>
  )
}

AutocompleteCustomer.defaultProps = {
  disabled: false,
  setSelectedCustomer: null,
}
