"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DirectDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function getUser() {
      try {
        const { data, error } = await supabase.auth.getUser()

        if (error) {
          throw error
        }

        setUser(data.user)
      } catch (err: any) {
        console.error("Error getting user:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  if (loading) {
    return <div className="p-8">Loading user information...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Direct Dashboard Access</h1>

      {error ? (
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Authentication Error</CardTitle>
            <CardDescription className="text-red-600">
              There was a problem retrieving your user information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/login")}>Return to Login</Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>You are successfully authenticated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">User ID:</span> {user.id}
              </div>
              <div>
                <span className="font-semibold">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-semibold">Created At:</span> {new Date(user.created_at).toLocaleString()}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={() => router.push("/dashboard")}>
                Go to Dashboard (Next.js Router)
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push("/login")
                }}
              >
                Sign Out
              </Button>
            </div>

            <div className="w-full">
              <Button className="w-full" onClick={() => (window.location.href = "/dashboard")}>
                Go to Dashboard (Hard Navigation)
              </Button>
            </div>

            <div className="w-full bg-muted p-4 rounded-md text-sm">
              <p className="font-semibold mb-2">Debug Session:</p>
              <Button
                variant="outline"
                size="sm"
                className="mb-2"
                onClick={async () => {
                  const { data } = await supabase.auth.getSession()
                  console.log("Current session:", data.session)
                  alert(`Session exists: ${!!data.session}\nUser: ${data.session?.user?.email}`)
                }}
              >
                Check Session
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

