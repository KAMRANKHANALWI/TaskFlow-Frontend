// ── Auth ──────────────────────────────────────────────
export interface LoginRequest {
  username: string   // OAuth2 uses username field — we send email here
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

// ── User ──────────────────────────────────────────────
export interface User {
  id: number
  email: string
  username: string
  is_active: boolean
  created_at: string
}

// ── Project ───────────────────────────────────────────
export interface Project {
  id: number
  name: string
  description: string
  owner_id: number
  created_at: string
}

export interface ProjectCreate {
  name: string
  description?: string
}

export interface ProjectUpdate {
  name?: string
  description?: string
}

// ── Tag ───────────────────────────────────────────────
export interface Tag {
  id: number
  name: string
  color: string
}

export interface TagCreate {
  name: string
  color?: string
}

// ── Task ──────────────────────────────────────────────
export type TaskStatus = "todo" | "in_progress" | "done"
export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  project_id: number
  assignee_id: number | null
  due_date: string | null
  created_at: string
  tags: Tag[]
}

export interface TaskCreate {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  project_id: number
  due_date?: string | null
}

export interface TaskUpdate {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
}

// ── API Error ─────────────────────────────────────────
export interface ApiError {
  error: boolean
  status_code: number
  message: string
}

// ── Query filters ─────────────────────────────────────
export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  project_id?: number
  skip?: number
  limit?: number
}