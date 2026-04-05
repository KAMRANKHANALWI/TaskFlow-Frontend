import axios from "axios"
import { authStorage } from "./auth"
import type {
  LoginRequest, RegisterRequest, TokenResponse, User,
  Project, ProjectCreate, ProjectUpdate,
  Task, TaskCreate, TaskUpdate, TaskFilters,
  Tag, TagCreate
} from "./types"

// ── Axios instance ────────────────────────────────────
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: { "Content-Type": "application/json" }
})

// attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStorage.removeToken()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────
export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<User>("/auth/register", data),

  login: (data: LoginRequest) => {
    // OAuth2 needs form encoding not JSON
    const form = new URLSearchParams()
    form.append("username", data.username)
    form.append("password", data.password)
    return api.post<TokenResponse>("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
  },

  me: () => api.get<User>("/users/me")
}

// ── Projects ──────────────────────────────────────────
export const projectsApi = {
  list: (skip = 0, limit = 10) =>
    api.get<Project[]>("/projects/", { params: { skip, limit } }),

  get: (id: number) =>
    api.get<Project>(`/projects/${id}`),

  create: (data: ProjectCreate) =>
    api.post<Project>("/projects/", data),

  update: (id: number, data: ProjectUpdate) =>
    api.put<Project>(`/projects/${id}`, data),

  delete: (id: number) =>
    api.delete(`/projects/${id}`)
}

// ── Tasks ─────────────────────────────────────────────
export const tasksApi = {
  list: (filters?: TaskFilters) =>
    api.get<Task[]>("/tasks/", { params: filters }),

  get: (id: number) =>
    api.get<Task>(`/tasks/${id}`),

  create: (data: TaskCreate) =>
    api.post<Task>("/tasks/", data),

  update: (id: number, data: TaskUpdate) =>
    api.put<Task>(`/tasks/${id}`, data),

  delete: (id: number) =>
    api.delete(`/tasks/${id}`)
}

// ── Tags ──────────────────────────────────────────────
export const tagsApi = {
  list: () =>
    api.get<Tag[]>("/tags/"),

  create: (data: TagCreate) =>
    api.post<Tag>("/tags/", data),

  assignToTask: (tagId: number, taskId: number) =>
    api.post<Tag>(`/tags/${tagId}/tasks/${taskId}`),

  removeFromTask: (tagId: number, taskId: number) =>
    api.delete(`/tags/${tagId}/tasks/${taskId}`),

  delete: (id: number) =>
    api.delete(`/tags/${id}`)
}

export default api