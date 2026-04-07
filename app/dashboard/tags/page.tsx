"use client"
import { useState, useEffect } from "react"
import { tagsApi } from "@/lib/api"
import type { Tag } from "@/lib/types"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { TagBadge } from "@/components/ui/Badge"

const PRESET_COLORS = [
  "#6366f1", "#3b82f6", "#10b981", "#f59e0b",
  "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6"
]

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [color, setColor] = useState(PRESET_COLORS[0])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const response = await tagsApi.list()
        setTags(response.data)
      } catch {
        console.error("Failed to load tags")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setCreating(true)
    setError(null)
    try {
      const response = await tagsApi.create({ name: name.trim(), color })
      setTags(prev => [...prev, response.data])
      setName("")
      setColor(PRESET_COLORS[0])
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        setError(axiosErr.response?.data?.message || "Failed to create tag")
      } else {
        setError("Failed to create tag")
      }
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this tag?")) return
    await tagsApi.delete(id)
    setTags(prev => prev.filter(t => t.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
        <p className="text-gray-500 mt-1">
          Create tags and assign them to tasks to organise your work.
        </p>
      </div>

      {/* Create form */}
      <Card>
        <h2 className="font-semibold text-gray-900 mb-4">Create a tag</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label="Tag name"
            placeholder="e.g. backend, urgent, bug"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          {/* Color picker */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Color</label>
            <div className="flex items-center gap-3 flex-wrap">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${color === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              {/* Preview */}
              <div className="ml-2">
                <TagBadge name={name || "preview"} color={color} />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div>
            <Button type="submit" loading={creating} disabled={!name.trim()}>
              Create tag
            </Button>
          </div>
        </form>
      </Card>

      {/* Tags list */}
      <Card>
        <h2 className="font-semibold text-gray-900 mb-4">
          All tags
          <span className="text-gray-400 font-normal ml-2 text-sm">({tags.length})</span>
        </h2>

        {tags.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            No tags yet — create one above
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100">
            {tags.map(tag => (
              <div key={tag.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <TagBadge name={tag.name} color={tag.color} />
                </div>
                <button
                  onClick={() => handleDelete(tag.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}