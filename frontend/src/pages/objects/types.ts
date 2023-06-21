export interface ObjectType {
  id: number
  name: string
  shared: boolean
  force: number
  height: number | null
  owner: string
  keywords: string
}

export type ObjectDetailType = Omit<ObjectType, 'owner'>
