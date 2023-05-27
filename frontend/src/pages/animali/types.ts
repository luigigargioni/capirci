export const AnimaleTypeArray = [
  { value: 'cane', label: 'Cane' },
  { value: 'gatto', label: 'Gatto' },
  { value: 'coniglio', label: 'Coniglio' },
  { value: 'tartaruga', label: 'Tartaruga' },
]

export const AnimaleSizeArray = [
  'Piccola',
  'Media',
  'Grande',
  'Gigante',
  'Unica',
]

export const AnimaleStanzaTypes = ['Singola', 'Doppia', 'Tripla', 'Quadrupla']

export interface AnimaleType {
  id: number
  name: string
  sex: string
  type: string
  breed: string
  size: string
  microchip: string
  note: string
  private_note: string
  customer_id: number
  first_name: string
  last_name: string
  date_update: string
  birth_date: string
  feeding: string
  allergies: string
  drugs: string
}
