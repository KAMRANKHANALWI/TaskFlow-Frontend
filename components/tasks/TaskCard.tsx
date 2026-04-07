"use client"
import { useState, useEffect } from "react"
import Card from "@/components/ui/Card"
import { StatusBadge, PriorityBadge, TagBadge } from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import { tagsApi } from "@/lib/api"
import type { Task, TaskStatus, Tag } from "@/lib/types"

interface TaskCardProps {
  task: Task
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: TaskStatus) => void
  onTagsChange?: (taskId: number, tags: Tag[]) => void
}

const statusFlow: Record<TaskStatus, TaskStatus> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo"
}

const statusFlowLabel: Record<TaskStatus, string> = {
  todo: "Start",
  in_progress: "Complete",
  done: "Reopen"
}

export default function TaskCard({ task, onDelete, onStatusChange, onTagsChange }: TaskCardProps) {
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [showTagMenu, setShowTagMenu] = useState(false)
  const [assigningTag, setAssigningTag] = useState(false)

  useEffect(() => {
    tagsApi.list().then(r => setAllTags(r.data)).catch(() => {})
  }, [])

  const assignedIds = new Set(task.tags.map(t => t.id))

  async function toggleTag(tag: Tag) {
    setAssigningTag(true)
    try {
      if (assignedIds.has(tag.id)) {
        await tagsApi.removeFromTask(tag.id, task.id)
        onTagsChange?.(task.id, task.tags.filter(t => t.id !== tag.id))
      } else {
        await tagsApi.assignToTask(tag.id, task.id)
        onTagsChange?.(task.id, [...task.tags, tag])
      }
    } catch {
      console.error("Failed to update tag")
    } finally {
      setAssigningTag(false)
    }
  }

  return (
    <Card className="flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 leading-tight flex-1">{task.title}</h3>
        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
        {task.tags.map(tag => (
          <TagBadge key={tag.id} name={tag.name} color={tag.color} />
        ))}
      </div>

      {/* Tag assignment */}
      <div className="relative">
        <button
          onClick={() => setShowTagMenu(!showTagMenu)}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
          disabled={assigningTag}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {assigningTag ? "Updating..." : "Manage tags"}
        </button>

        {showTagMenu && (
          <>
            {/* backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setShowTagMenu(false)} />
            <div className="absolute left-0 top-6 z-20 bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-40">
              {allTags.length === 0 ? (
                <p className="text-xs text-gray-400 px-2 py-1">No tags yet</p>
              ) : (
                allTags.map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag)}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-gray-50 transition-colors"
                  >
                    {/* checkmark if assigned */}
                    <span className="w-4 text-green-500 text-xs font-bold">
                      {assignedIds.has(tag.id) ? "✓" : ""}
                    </span>
                    <TagBadge name={tag.name} color={tag.color} />
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          {task.due_date
            ? `Due ${new Date(task.due_date).toLocaleDateString()}`
            : "No due date"
          }
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onStatusChange(task.id, statusFlow[task.status])}
        >
          {statusFlowLabel[task.status]}
        </Button>
      </div>
    </Card>
  )
}