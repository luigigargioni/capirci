export interface LocationType {
  id: number
  name: string
  shared: boolean
  position: string
  owner: number
  robot: number
}

export type LocationDetailType = Omit<LocationType, 'owner' | 'robot'>
