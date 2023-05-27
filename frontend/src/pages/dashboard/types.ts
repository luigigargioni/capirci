export interface StatsType {
  lastWeek: number
  checkIn: number
  checkOut: number
}

export interface ServiceToDeliver {
  id: number
  reservation_id: number
  pet_id: number
  pet_name: string
  service_key: string
  service_id: number
  is_grooming: number
  service_name: string
  count: number
}
