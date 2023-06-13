export interface TaskType {
  id: number
  description: string
  last_modified: string
  name: string
  owner: string
  shared: boolean
}

export type TaskDetailType = Omit<TaskType, 'owner' | 'last_modified'>
