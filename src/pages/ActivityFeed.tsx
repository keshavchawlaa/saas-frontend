import { useEffect, useRef, useState } from 'react';
import { getActivityPage } from '../api/activity.api';


interface ActivityLog {
  id: string
  message: string
  timestamp: string
  actor: {
    id: string
    name: string
  }
}

const ActivityFeed = () => {
const [items, setItems] = useState<ActivityLog[]>([])
const [cursor, setCursor] = useState<string | null>(null)
const [hasMore, setHasMore] = useState(true)
const [loading, setLoading] = useState(false)

const sentinelRef = useRef<HTMLDivElement | null>(null)


const loadMore = async () => {
  if (loading || !hasMore) return

  setLoading(true)

  const res = await getActivityPage(20, cursor ?? undefined)

  setItems(prev => {
    const ids = new Set(prev.map(i => i.id))
    const unique = res.items.filter(
      (i: ActivityLog) => !ids.has(i.id)
    )
    return [...prev, ...unique]
  })

  setCursor(res.nextCursor ?? null)
  setHasMore(Boolean(res.nextCursor))
  setLoading(false)
}





  // Infinite scroll observer
 useEffect(() => {
  if (!sentinelRef.current) return

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadMore()
    }
  })

  observer.observe(sentinelRef.current)

  return () => observer.disconnect()
}, [cursor, hasMore])

  return (
  <div className="activity-page">
    <h1>Activity Feed</h1>

    <div className="activity-list">
      {items.map(log => (
        <div key={log.id} className="activity-card">
          <div className="activity-message">
            <strong>{log.actor.name}</strong> {log.message}
          </div>

          <div className="activity-time">
            {new Date(log.timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>

    {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
    {loading && <p>Loading more…</p>}
  </div>
)

};

export default ActivityFeed;
