export interface Task {
  id: string
  title: string
  description?: string | null
  status: string
  projectId?: string
  orgId?: string
  assigneeId?: string | null
  assignee?: {
    id: string
    name?: string | null
    email: string
  } | null
  createdAt: string
  updatedAt?: string
}
