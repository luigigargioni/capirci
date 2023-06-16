export interface MyRobotType {
  id: number
  name: string
  robot: number
  user: number
}

export type MyRobotDetailType = Omit<MyRobotType, 'user'>
