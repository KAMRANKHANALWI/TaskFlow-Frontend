"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { tasksApi, projectsApi } from "@/lib/api";
import type { Task, Project, TaskStatus, TaskPriority, Tag } from "@/lib/types";
import TaskCard from "@/components/tasks/TaskCard";
import CreateTaskModal from "@/components/tasks/CreateTaskModal";
import TaskFiltersComponent from "@/components/tasks/TaskFilters";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function TasksPage() {
  const searchParams = useSearchParams();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // filters
  const [status, setStatus] = useState<TaskStatus | "">("");
  const [priority, setPriority] = useState<TaskPriority | "">("");
  const [projectId, setProjectId] = useState<number | "">(
    searchParams.get("project_id")
      ? Number(searchParams.get("project_id"))
      : "",
  );

  const loadTasks = useCallback(async () => {
    try {
      const params: Record<string, string | number> = {};
      if (status) params.status = status;
      if (priority) params.priority = priority;
      if (projectId) params.project_id = projectId;

      const response = await tasksApi.list(
        Object.keys(params).length ? params : undefined,
      );
      setTasks(response.data);
    } catch {
      console.error("Failed to load tasks");
    }
  }, [status, priority, projectId]);

  // initial load
  useEffect(() => {
    async function init() {
      const [, projectsRes] = await Promise.all([
        loadTasks(),
        projectsApi.list(0, 100),
      ]);
      setProjects(projectsRes.data);
      setLoading(false);
    }
    init();
  }, [loadTasks]);

  // reload when filters change
  useEffect(() => {
    if (!loading) loadTasks();
  }, [status, priority, projectId, loadTasks, loading]);

  async function handleCreate(data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    project_id: number;
    due_date: string | null;
  }) {
    const response = await tasksApi.create(data);
    setTasks((prev) => [response.data, ...prev]);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this task?")) return;
    await tasksApi.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleStatusChange(id: number, newStatus: TaskStatus) {
    const response = await tasksApi.update(id, { status: newStatus });
    setTasks((prev) => prev.map((t) => (t.id === id ? response.data : t)));
  }

  function clearFilters() {
    setStatus("");
    setPriority("");
    setProjectId("");
  }

  function handleTagsChange(taskId: number, newTags: Tag[]) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, tags: newTags } : t)),
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            {(status || priority || projectId) && " (filtered)"}
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ New Task</Button>
      </div>

      {/* Filters */}
      <TaskFiltersComponent
        status={status}
        priority={priority}
        projectId={projectId}
        projects={projects}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onProjectChange={setProjectId}
        onClear={clearFilters}
      />

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-medium text-gray-900">No tasks found</p>
            <p className="text-sm text-gray-500 mt-1">
              {status || priority || projectId
                ? "Try clearing filters"
                : "Create your first task"}
            </p>
          </div>
          {!status && !priority && !projectId && (
            <Button onClick={() => setShowModal(true)}>+ New Task</Button>
          )}
        </div>
      )}

      {/* Task grid */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onTagsChange={handleTagsChange}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CreateTaskModal
          projects={projects}
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
