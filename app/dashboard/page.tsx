"use client";
import { useAuth } from "@/lib/AuthContext";
import Card from "@/components/ui/Card";

export default function DashboardPage() {
  const { user } = useAuth();

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-3xl font-bold text-gray-900">—</p>
          <p className="text-xs text-gray-400">Loading...</p>
        </Card>

        <Card className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-3xl font-bold text-gray-900">—</p>
          <p className="text-xs text-gray-400">Loading...</p>
        </Card>

        <Card className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">—</p>
          <p className="text-xs text-gray-400">Loading...</p>
        </Card>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500">
            Organise your work into projects and track progress.
          </p>
          <a
            href="/dashboard/projects"
            className="text-sm text-blue-600
            hover:underline font-medium"
          >
            {" "}
            View all projects →
          </a>
        </Card>

        <Card className="flex flex-col gap-3">
          <h2 className="font-semibold text-gray-900">Tasks</h2>
          <p className="text-sm text-gray-500">
            Create, assign and track tasks across all your projects.
          </p>
          <a
            href="/dashboard/tasks"
            className="text-sm text-blue-600
            hover:underline font-medium"
          >
            {" "}
            View all tasks →
          </a>
        </Card>
      </div>
    </div>
  );
}
