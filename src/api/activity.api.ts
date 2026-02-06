import api from './axios'

export interface ActivityActor {
  id: string
  name: string
  email: string
}

export interface ActivityLog {
  type: string
  message: string
  timestamp: string
  actor: ActivityActor
}

export interface GroupedActivityLogs {
  today: ActivityLog[]
  yesterday: ActivityLog[]
  older: ActivityLog[]
}

// export const getActivityLogs = async (): Promise<GroupedActivityLogs> => {
//   const { data } = await api.get('/activity?grouped=true')
//   return data
// }

export const getActivityLogs = async (
  params?: { actorId?: string }
): Promise<GroupedActivityLogs> => {
  const { data } = await api.get('/activity', {
    params: {
      grouped: true,
      ...params,
    },
  })
  return data
}

export const getActivityPage = async (
  limit?: number,
  cursor?: string,
  entity?: string,
  actorId?: string
) => {
  const res = await api.get('/activity/page', {
    params: { limit, cursor, entity, actorId },
  })

  return res.data
}