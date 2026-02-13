import { useEffect, useState } from 'react'
import {
  getNotifications,
  markNotificationRead,
} from '../api/notifications.api'

type ActivityActor = {
  id: string
  name?: string
  email?: string
}

type Activity = {
  type: string
  message: string
  timestamp: string
  actor?: ActivityActor
}

type NotificationItem = {
  id: string
  read: boolean
  createdAt: string
  activity: Activity
}

const Notifications = () => {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadNotifications = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getNotifications()
      setItems(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id)
      setItems(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark as read')
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Notifications</h1>
      </div>

      {error && <p className="form-error">{error}</p>}
      {loading && <p>Loading notifications...</p>}
      {!loading && !items.length && <p>No notifications.</p>}

      <div className="list">
        {items.map(n => (
          <div
            key={n.id}
            className={`list-item ${n.read ? 'is-read' : 'is-unread'}`}
          >
            <div className="list-main">
              <div className="list-title">{n.activity.message}</div>
              <div className="list-subtle">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
            {!n.read && (
              <button onClick={() => handleMarkRead(n.id)}>Mark read</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Notifications
