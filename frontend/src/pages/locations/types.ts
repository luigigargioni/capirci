export interface LocationType {
  id: number
  name: string
  shared: boolean
  position: string
  owner: number
  owner__username: string
  robot: number | null
}

export type LocationDetailType = Omit<LocationType, 'owner' | 'owner__username'>
