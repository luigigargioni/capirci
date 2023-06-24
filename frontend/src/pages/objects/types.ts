export interface ObjectType {
  id: number
  name: string
  shared: boolean
  force: number
  height: number | null
  owner: number
  keywords: string[]
  robot: number | null
  photo: string
  contour: string
  shape: string
}

export type ObjectDetailType = Omit<ObjectType, 'owner'>
