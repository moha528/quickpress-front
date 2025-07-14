"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { getArticle, type Article } from "@/lib/data"
import { Navbar } from "@/components/layout/navbar"
import { ArrowLeft, Edit, Calendar, User } from "lucide-react"
import Link from "next/link"

export default function ArticlePage() {
  const { user, token } = useAuth()
  const params = useParams()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchArticle = async () => {
      if (!params.id || !token) return

      try {
        const response = await getArticle(Number.parseInt(params.id as string), token)
        setArticle(response.data)
      } catch (err) {
        setError("Failed to fetch article")
      } finally {
        setIsLoading(false)
      }
    }

    fetchArticle()
  }, [params.id, token])

  const canEdit = user?.role === "EDITEUR" || user?.role === "ADMIN"

  if (!user) return null

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-8 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <Button asChild>
              <Link href="/articles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/articles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
        </div>

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {article.category && <Badge variant="secondary">{article.category.name}</Badge>}
              </div>
              {canEdit && (
                <Button asChild>
                  <Link href={`/articles/${article.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Article
                  </Link>
                </Button>
              )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {article.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.author.username}</span>
                </div>
              )}
              {article.created_at && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </header>

          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-gray max-w-none">
                {article.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  )
}
