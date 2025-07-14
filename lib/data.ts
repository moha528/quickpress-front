const BASE_URL = "http://localhost:8000/api"

// Types
export interface User {
  id: number
  username: string
  role: "VISITEUR" | "EDITEUR" | "ADMIN"
  created_at?: string
}

export interface Category {
  id: number
  name: string
  description?: string
  created_at?: string
}

export interface Article {
  id: number
  title: string
  content: string
  categoryId: number
  category?: Category
  authorId: number
  author?: User
  created_at?: string
  updated_at?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Auth functions
export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    throw new Error("Login failed")
  }

  return response.json()
}

export async function register(username: string, password: string, role = "VISITEUR"): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, role }),
  })

  if (!response.ok) {
    throw new Error("Registration failed")
  }

  return response.json()
}

export async function getProfile(token: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to get profile")
  }

  return response.json()
}

// Articles functions
export async function getArticles(
  params?: {
    page?: number
    limit?: number
    category?: number
    search?: string
  },
  token?: string,
): Promise<PaginatedResponse<Article>> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.append("page", params.page.toString())
  if (params?.limit) searchParams.append("limit", params.limit.toString())
  if (params?.category) searchParams.append("category", params.category.toString())
  if (params?.search) searchParams.append("search", params.search)

  const headers: HeadersInit = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}/articles?${searchParams}`, {
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch articles")
  }

  return response.json()
}

export async function getArticle(id: number, token?: string): Promise<{success: boolean; data: Article}> {
  const headers: HeadersInit = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}/articles/${id}`, {
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch article")
  }

  return response.json()
}

export async function createArticle(
  article: Omit<Article, "id" | "created_at" | "updated_at">,
  token: string,
): Promise<Article> {
  const response = await fetch(`${BASE_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(article),
  })

  if (!response.ok) {
    throw new Error("Failed to create article")
  }

  return response.json()
}

export async function updateArticle(id: number, article: Partial<Article>, token: string): Promise<Article> {
  const response = await fetch(`${BASE_URL}/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(article),
  })

  if (!response.ok) {
    throw new Error("Failed to update article")
  }

  return response.json()
}

export async function deleteArticle(id: number, token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/articles/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete article")
  }
}

// Categories functions
export async function getCategories(token?: string): Promise<{success: boolean; data: Category[]}> {
  const headers: HeadersInit = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}/categories`, {
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }

  return response.json()
}

export async function getCategory(id: number, token?: string): Promise<{success: boolean; data: Category}> {
  const headers: HeadersInit = {}
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}/categories/${id}`, {
    headers,
  })

  if (!response.ok) {
    throw new Error("Failed to fetch category")
  }

  return response.json()
}

export async function createCategory(category: Omit<Category, "id" | "created_at">, token: string): Promise<Category> {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    throw new Error("Failed to create category")
  }

  return response.json()
}

export async function updateCategory(id: number, category: Partial<Category>, token: string): Promise<Category> {
  const response = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    throw new Error("Failed to update category")
  }

  return response.json()
}

export async function deleteCategory(id: number, token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete category")
  }
}

// Users functions (Admin only)
export async function getUsers(token: string): Promise<{success: boolean; data: User[]}> {
  const response = await fetch(`${BASE_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch users")
  }

  return response.json()
}

export async function getUser(id: number, token: string): Promise<{success: boolean; data: User}> {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  return response.json()
}

export async function createUser(
  user: Omit<User, "id" | "created_at"> & { password: string },
  token: string,
): Promise<User> {
  const response = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error("Failed to create user")
  }

  return response.json()
}

export async function updateUser(id: number, user: Partial<User>, token: string): Promise<User> {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    throw new Error("Failed to update user")
  }

  return response.json()
}

export async function deleteUser(id: number, token: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete user")
  }
}
