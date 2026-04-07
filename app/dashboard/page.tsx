"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"
import { projectsApi, tasksApi } from "@/lib/api"
import Card from "@/components/ui/Card"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalTasks: 0,
    inProgress: 0,
    done: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          projectsApi.list(0, 100),
          tasksApi.list()
        ])
        const tasks = tasksRes.data
        setStats({
          totalProjects: projectsRes.data.length,
          totalTasks: tasks.length,
          inProgress: tasks.filter(t => t.status === "in_progress").length,
          done: tasks.filter(t => t.status === "done").length
        })
      } catch {
        console.error("Failed to load stats")
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.username} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
            <p className="text-xs text-gray-400">across all your work</p>
          </Card>

          <Card className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalTasks}</p>
            <p className="text-xs text-gray-400">created so far</p>
          </Card>

          <Card className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
            <p className="text-xs text-gray-400">actively being worked on</p>
          </Card>

          <Card className="flex flex-col gap-1">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-3xl font-bold text-green-600">{stats.done}</p>
            <p className="text-xs text-gray-400">tasks done</p>
          </Card>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500">
            Organise your work into projects and track progress.
          </p>
          <a href="/dashboard/projects" className="text-sm text-blue-600 hover:underline font-medium">
            View all projects →
          </a>
        </Card>

        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-900">Tasks</h2>
          <p className="text-sm text-gray-500">
            Create, assign and track tasks across all your projects.
          </p>
          <a href="/dashboard/tasks" className="text-sm text-blue-600 hover:underline font-medium">
            View all tasks →
          </a>
        </Card>
      </div>
    </div>
  )
}