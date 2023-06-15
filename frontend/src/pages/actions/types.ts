export interface ActionType {
  id: number
  name: string
  point: string
  shared: boolean
  owner: number
  robot: number
}

export type ActionDetailType = Omit<ActionType, 'owner' | 'robot'>
