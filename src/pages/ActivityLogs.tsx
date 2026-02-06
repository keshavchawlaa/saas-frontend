import { useEffect, useState } from 'react'
import { getActivityLogs,  } from '../api/activity.api'
// import { useAuth } from '../auth/useAuth'
import type { GroupedActivityLogs, } from '../api/activity.api'
import { getUsers } from '../api/users.api';


const iconMap: Record<string, string> = {
  ASSIGN: '👤',
  UNASSIGN: '🚫',
  STATUS: '🔄',
  COMMENT: '💬',
}





const Section = ({
  title,
  logs = [],
}: {
  title: string
  logs?: any[]
}) => {
  if (!logs || logs.length === 0) return null



  return (
    <section className="activity-section">
      <h3>{title}</h3>

      <div className="activity-list">
        {logs.map((log, idx) => (
          <div key={idx} className="activity-card">
            <div className="activity-message">
              <span style={{ marginRight: 6 }}>
                {iconMap[log.type] ?? '📝'}
              </span>
              <strong>{log.actor.name}</strong> {log.message}
            </div>

            <div className="activity-time">
              {new Date(log.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


// const ActivityLogs = () => {
//   const { user, isLoading } = useAuth()
//   const [logs, setLogs] = useState<GroupedActivityLogs | null>(null)

//   useEffect(() => {
//     if (isLoading || !user) return
//     getActivityLogs().then(setLogs)
//   }, [isLoading, user])

//   if (isLoading || !logs) return <div>Loading activity logs…</div>

//   return (
//     <div>
//       <h1>Activity Logs</h1>

//       <Section title="Today" logs={logs.today} />
//       <Section title="Yesterday" logs={logs.yesterday} />
//       <Section title="Older" logs={logs.older} />
//     </div>
//   )
// }

// export default ActivityLogs

const ActivityLogs = () => {
  const [logs, setLogs] = useState<GroupedActivityLogs | null>(null)
  const [actorId, setActorId] = useState<string | undefined>(undefined)
  const [users, setUsers] = useState<any[]>([])

  // fetch users ONCE
useEffect(() => {
  getUsers().then(users => {
    setUsers(users)
  })
}, [])

  // refetch activity when actor changes
  useEffect(() => {
    getActivityLogs({ actorId }).then(setLogs)
  }, [actorId])

  if (!logs) return <div>Loading activity…</div>
const safeLogs = {
  today: logs.today ?? [],
  yesterday: logs.yesterday ?? [],
  older: logs.older ?? [],
}
  return (
  <div className="activity-page">
    <div className="activity-filter">
      <label htmlFor="activity-user-filter">
        Filter by user
      </label>

      <select
        id="activity-user-filter"
        value={actorId ?? ''}
        onChange={(e) =>
          setActorId(e.target.value || undefined)
        }
      >
        <option value="">All users</option>
        {users.map((m) => (
          <option key={m.user.id} value={m.user.id}>
            {m.user.name || m.user.email}
          </option>
        ))}
      </select>
    </div>

    <Section title="Today" logs={safeLogs.today} />
    <Section title="Yesterday" logs={safeLogs.yesterday} />
    <Section title="Older" logs={safeLogs.older} />
  </div>
)

}

export default ActivityLogs

