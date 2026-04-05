import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
  onDelete: (id: number) => void
  taskCount?: number
}

export default function ProjectCard({ project, onDelete, taskCount = 0 }: ProjectCardProps) {
  const initials = project.name.slice(0, 2).toUpperCase()

  return (
    <Card className="flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Color avatar */}
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 leading-tight">{project.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Created {new Date(project.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {taskCount} {taskCount === 1 ? "task" : "tasks"}
        </span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = `/dashboard/tasks?project_id=${project.id}`}
          >
            View tasks
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(project.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  )
}