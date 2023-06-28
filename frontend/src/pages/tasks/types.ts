export interface TaskType {
  id: number
  description: string
  last_modified: string
  name: string
  owner: string
  owner__username: string
  shared: boolean
  code: string
}

export type TaskDetailType = Omit<
  TaskType,
  'owner' | 'owner__username' | 'last_modified'
>
