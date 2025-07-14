"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import { getArticle, updateArticle, getCategories, type Category } from "@/lib/data"
import { Navbar } from "@/components/layout/navbar"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditArticlePage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState<string>("")
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id || !token) return

      try {
        const [articleResponse, categoriesResponse] = await Promise.all([
          getArticle(Number.parseInt(params.id as string), token),
          getCategories(token),
        ])

        setTitle(articleResponse.data.title)
        setContent(articleResponse.data.content)
        setCategoryId(articleResponse.data.categoryId.toString())
        setCategories(categoriesResponse.data)
      } catch (error) {
        setError("Failed to fetch article data")
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [params.id, token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token || !params.id) return

    setError("")
    setIsLoading(true)

    try {
      await updateArticle(
        Number.parseInt(params.id as string),
        {
          title,
          content,
          categoryId: Number.parseInt(categoryId),
        },
        token,
      )

      router.push(`/articles/${params.id}`)
    } catch (err) {
      setError("Failed to update article")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || (user.role !== "EDITEUR" && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-8">
          <Alert>
            <AlertDescription>You don't have permission to edit articles.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-8 max-w-2xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 max-w-2xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/articles/${params.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Article
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Article</h1>
          <p className="text-muted-foreground">Update your article information</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
            <CardDescription>Modify the article information below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter article title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Write your article content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Article"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={`/articles/${params.id}`}>Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
