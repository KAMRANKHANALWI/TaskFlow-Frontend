import Card from "@/components/ui/Card"
import { StatusBadge, PriorityBadge, TagBadge } from "@/components/ui/Badge"
import Button from "@/components/ui/Button"
import type { Task, TaskStatus } from "@/lib/types"

interface TaskCardProps {
  task: Task
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: TaskStatus) => void
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

export default function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
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