export interface ActionType {
  id: number
  name: string
  point: string
  shared: boolean
  owner: number
  owner__username: string
  robot: number | null
  robot__name: string
}

export type ActionDetailType = Omit<
  ActionType,
  'owner' | 'owner__username' | 'robot__name'
>
