import React from 'react'
import { ClienteType } from 'pages/clienti/types'

export type PrenotazioniListType = {
  id: number
  first_name: string
  last_name: string
  customer_id: number
  date_from: string
  date_to: string
  note: string
  private_note: string
  date_add: string
  confirmed: number
  active: number
  advance_payment_method_id: string
  advance_payment_date: string
  advance_payment_amount: number
  payment_method_id: string
  payment_date: string
  deleted: number
  delete_date: string
  delete_user: string
  total_accomodation: number
  discount_advance_accomodation: number
  pets_names: string
  webcam: string
  payment_amount: number
}

export type GroomingServicesType = {
  id: number
  key: string
  label: string
  class: string
}

export type AnimalePrestazioniType = {
  id: number
  name: string
  type: string
  breed: string
  size: string
  sex: string
  microchip: string
  note: string
  private_note: string
  room: string
  webcam: number
  medicines: number
  photo: number
  video: number
  walk30: number
  walk60: number
  bath: number
  clean_ears: number
  scissor_cut: number
  nail_cut: number
  shear: number
  strip: number
  comb: number
  hygiene: number
  knot_removal: number
  ozzonized_water: number
  spa_beauty: number
  spa_slime: number
  double_shampoo: number
  parasite_shampoo: number
  lenitive_shampoo: number
  extravolume_conditioner: number
  url: string
  birth_date: string
  feeding: string
  allergies: string
  drugs: string
}

type PrenotazioniClienteType = Omit<ClienteType, 'id'>
type PrenotazioniType = Omit<
  PrenotazioniListType,
  'first_name' | 'last_name' | 'pets_names' | 'webcam'
>

export type DettaglioPrenotazioneType = PrenotazioniType &
  PrenotazioniClienteType & {
    pets: AnimalePrestazioniType[]
  }

export type FormPrenotazioneType = DettaglioPrenotazioneType

export type PaymentMethodType = {
  id: number
  descr: string
}

export const formatPetsNames = (petsNames: string) => {
  if (!petsNames) return ''
  return (
    <ul style={{ marginBottom: 0 }}>
      {petsNames.split('|||').map((pet) => {
        if (!pet) return null
        const petName = pet.split('---')[1].trim()
        const petType = pet.split('---')[0].trim()
        return (
          <li key={pet}>
            {petName}: {petType}
          </li>
        )
      })}
    </ul>
  )
}

export const formatPetsNamesString = (petsNames: string) => {
  if (!petsNames) return ''
  return petsNames.split('|||').map((pet) => {
    const petName = pet.split('---')[1].trim()
    const petType = pet.split('---')[0].trim()
    return `• ${petName}: ${petType}\n`
  })
}

export const styleAutocomplete = {
  '.MuiOutlinedInput-root .MuiAutocomplete-input': {
    padding: '10.5px 14px 10.5px 12px',
  },
  '.MuiOutlinedInput-root': {
    padding: 0,
  },
  '.MuiOutlinedInput-root .MuiAutocomplete-endAdornment': {
    top: 'unset',
  },
}
