import api from './axios'

export const getNotifications = async () => {
  const res = await api.get('/notifications')
  return res.data
}

export const markNotificationRead = async (id: string) => {
  const res = await api.patch(`/notifications/${id}/read`)
  return res.data
}
