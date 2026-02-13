import { useEffect, useState } from 'react'
import { createProject, getProjects } from '../api/projects.api'
import type { Project } from '../types/project'

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleCreate = async () => {
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    try {
      await createProject(name.trim())
      setName('')
      await loadProjects()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Projects</h1>
      </div>

      <section className="panel">
        <h3>Create Project</h3>
        <div className="inline-form">
          <input
            placeholder="Project name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            className="primary"
            onClick={handleCreate}
            disabled={saving}
          >
            {saving ? 'Creating...' : 'Create'}
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </section>

      <section className="panel">
        <h3>All Projects</h3>
        {loading && <p>Loading projects...</p>}
        {!loading && !projects.length && <p>No projects yet.</p>}
        <div className="card-grid">
          {projects.map(p => (
            <div key={p.id} className="card">
              <div className="card-title">{p.name}</div>
              <div className="card-subtle">ID: {p.id}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Projects
