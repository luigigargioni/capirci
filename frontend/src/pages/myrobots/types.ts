export interface MyRobotType {
  id: number
  name: string
  robot: number
  robot_name: string
}

export type MyRobotDetailType = Omit<MyRobotType, 'robot'>
