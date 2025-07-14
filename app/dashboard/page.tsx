"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth"
import { getArticles, getCategories, getUsers } from "@/lib/data"
import { BookOpen, FolderOpen, Users, TrendingUp } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [stats, setStats] = useState({
    articles: 0,
    categories: 0,
    users: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return

      try {
        const [articlesResponse, categoriesResponse] = await Promise.all([
          getArticles({ page: 1, limit: 1 }, token),
          getCategories(token),
        ])

        let usersCount = 0
        if (user?.role === "ADMIN") {
          const usersResponse = await getUsers(token)
          usersCount = usersResponse.length
        }

        setStats({
          articles: articlesResponse.total,
          categories: categoriesResponse.length,
          users: usersCount,
        })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [token, user?.role])

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.username}! Here's an overview of your blog.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.articles}</div>
              <p className="text-xs text-muted-foreground">Published articles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isLoading ? "..." : stats.categories}</div>
              <p className="text-xs text-muted-foreground">Article categories</p>
            </CardContent>
          </Card>

          {user.role === "ADMIN" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{isLoading ? "..." : stats.users}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Role</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.role}</div>
              <p className="text-xs text-muted-foreground">Current permissions</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks based on your role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <p>• View and read articles</p>
                {(user.role === "EDITEUR" || user.role === "ADMIN") && (
                  <>
                    <p>• Create and edit articles</p>
                    <p>• Manage categories</p>
                  </>
                )}
                {user.role === "ADMIN" && <p>• Manage users and permissions</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Activity tracking coming soon...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
