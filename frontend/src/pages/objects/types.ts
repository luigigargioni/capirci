export interface ObjectType {
  id: number
  name: string
  shared: boolean
  force: number
  height: number | null
  owner: number
  keywords: string[]
  robot: number | null
}

export type ObjectDetailType = Omit<ObjectType, 'owner'>
