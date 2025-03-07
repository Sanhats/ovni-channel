// app/test-auth/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function TestAuthPage() {
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error checking session:', error)
          setSessionInfo({ error: error.message })
        } else {
          setSessionInfo({
            hasSession: !!data.session,
            userId: data.session?.user?.id,
            email: data.session?.user?.email,
            expiresAt: data.session?.expires_at
          })
        }
      } catch (error: any) {
        console.error('Error in checkSession:', error)
        setSessionInfo({ error: error.message })
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return <div className="p-8">Checking authentication status...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>
      <pre className="bg-gray-100 p-4 rounded mb-4">
        {JSON.stringify(sessionInfo, null, 2)}
      </pre>
      
      {sessionInfo?.hasSession ? (
        <Button onClick={handleSignOut} variant="destructive">Sign Out</Button>
      ) : (
        <Button onClick={() => window.location.href = '/login'}>Go to Login</Button>
      )}
      
      <div className="mt-4">
        <a href="/dashboard" className="text-blue-500 hover:underline block mb-2">
          Try accessing dashboard
        </a>
        <a href="/login" className="text-blue-500 hover:underline block">
          Go to login page
        </a>
      </div>
    </div>
  )
}