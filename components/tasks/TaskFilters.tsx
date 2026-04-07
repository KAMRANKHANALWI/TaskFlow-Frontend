"use client"
import type { TaskStatus, TaskPriority, Project } from "@/lib/types"

interface TaskFiltersProps {
  status: TaskStatus | ""
  priority: TaskPriority | ""
  projectId: number | ""
  projects: Project[]
  onStatusChange: (v: TaskStatus | "") => void
  onPriorityChange: (v: TaskPriority | "") => void
  onProjectChange: (v: number | "") => void
  onClear: () => void
}

export default function TaskFilters({
  status, priority, projectId, projects,
  onStatusChange, onPriorityChange, onProjectChange, onClear
}: TaskFiltersProps) {
  const hasFilters = status || priority || projectId !== ""

  const selectClass = "text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Status */}
      <select
        value={status}
        onChange={e => onStatusChange(e.target.value as TaskStatus | "")}
        className={selectClass}
      >
        <option value="">All statuses</option>
        <option value="todo">To Do</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {/* Priority */}
      <select
        value={priority}
        onChange={e => onPriorityChange(e.target.value as TaskPriority | "")}
        className={selectClass}
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* Project */}
      <select
        value={projectId}
        onChange={e => onProjectChange(e.target.value ? Number(e.target.value) : "")}
        className={selectClass}
      >
        <option value="">All projects</option>
        {projects.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}