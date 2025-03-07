// components/auth-debug.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

export function AuthDebug() {
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

  if (loading) {
    return <div>Checking authentication status...</div>
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg text-sm">
      <h3 className="font-bold mb-2">Auth Debug Info</h3>
      <pre className="whitespace-pre-wrap">{JSON.stringify(sessionInfo, null, 2)}</pre>
      <div className="mt-2">
        <button 
          onClick={async () => {
            const { error } = await supabase.auth.signOut()
            if (error) {
              console.error('Error signing out:', error)
            } else {
              window.location.href = '/login'
            }
          }}
          className="text-red-500 text-xs hover:underline"
        >
          Force Sign Out
        </button>
      </div>
    </div>
  )
}