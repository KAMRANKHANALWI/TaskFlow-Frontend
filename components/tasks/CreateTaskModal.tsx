"use client"
import { useState } from "react"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import type { Project, TaskStatus, TaskPriority } from "@/lib/types"

interface CreateTaskModalProps {
  projects: Project[]
  onClose: () => void
  onCreate: (data: {
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    project_id: number
    due_date: string | null
  }) => Promise<void>
}

export default function CreateTaskModal({ projects, onClose, onCreate }: CreateTaskModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    project_id: projects[0]?.id || 0,
    due_date: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.project_id) return

    setLoading(true)
    setError(null)
    try {
      await onCreate({
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        priority: form.priority,
        project_id: Number(form.project_id),
        due_date: form.due_date || null
      })
      onClose()
    } catch {
      setError("Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  const selectClass = "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">New Task</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <Input
              label="Task title"
              name="title"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Description <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                name="description"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add more details..."
                rows={2}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Row: status + priority */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={selectClass}>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <select name="priority" value={form.priority} onChange={handleChange} className={selectClass}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Project */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Project</label>
              <select name="project_id" value={form.project_id} onChange={handleChange} className={selectClass} required>
                <option value="">Select a project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Due date */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Due date <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className={selectClass}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
              <Button type="submit" loading={loading} disabled={!form.title.trim() || !form.project_id}>
                Create task
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}