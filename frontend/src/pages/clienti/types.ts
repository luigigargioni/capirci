export interface PetClienteType {
  id: number
  name: string
  type: string
  breed: string
  size: string
  sex: string
  note: string
  private_note: string
  microchip: string
  url: string
}

export interface ClienteType {
  id: number
  first_name: string
  last_name: string
  fiscal_code: string
  sex: string
  birth_date: string
  birth_city: string
  birth_state: string
  zip: string
  state: string
  address: string
  city: string
  phone: string
  email: string
  doc_type: string
  doc_code: string
  veterinarian_id: number
  pets: PetClienteType[]
}

export type FormClienteType = ClienteType

export const DocTypeEnum = {
  CARTAIDENTITA: {
    value: 'C.I.',
    label: "Carta d'identità",
  },
  PATENTE: {
    value: 'Patente',
    label: 'Patente',
  },
  PASSAPORTO: {
    value: 'Passaporto',
    label: 'Passaporto',
  },
}
