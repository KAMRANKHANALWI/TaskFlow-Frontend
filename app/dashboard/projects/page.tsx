"use client"
import { useState, useEffect } from "react"
import { projectsApi, tasksApi } from "@/lib/api"
import type { Project, Task } from "@/lib/types"
import ProjectCard from "@/components/projects/ProjectCard"
import CreateProjectModal from "@/components/projects/CreateProjectModal"
import Button from "@/components/ui/Button"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          projectsApi.list(0, 100),
          tasksApi.list()
        ])
        setProjects(projectsRes.data)
        setTasks(tasksRes.data)
      } catch {
        setError("Failed to load projects")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // count tasks per project
  function getTaskCount(projectId: number) {
    return tasks.filter(t => t.project_id === projectId).length
  }

  async function handleCreate(name: string, description: string) {
    const response = await projectsApi.create({ name, description })
    setProjects(prev => [response.data, ...prev])
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project? This cannot be undone.")) return
    await projectsApi.delete(id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          + New Project
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Empty state */}
      {projects.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">No projects yet</p>
            <p className="text-sm text-gray-500 mt-1">Create your first project to get started</p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            + New Project
          </Button>
        </div>
      )}

      {/* Grid */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              taskCount={getTaskCount(project.id)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateProjectModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}