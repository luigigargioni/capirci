export type PositionType = {
  X: number
  Y: number
  Z: number
  RX: number
  RY: number
  RZ: number
  FIG: number
}

export interface LocationType {
  id: number
  name: string
  shared: boolean
  position: PositionType | null
  owner: number
  owner__username: string
  robot: number | null
}

export type LocationDetailType = Omit<LocationType, 'owner' | 'owner__username'>
