// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'

export default function LoginPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setDebugInfo(null)

    try {
      console.log('Attempting login with:', { email: formData.email })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        console.error('Login error:', error)
        setDebugInfo(`Error: ${error.message} (${error.status})`)
        throw error
      }

      console.log('Login successful:', data)
      
      // Verify the session was created
      const { data: sessionData } = await supabase.auth.getSession()
      console.log('Session after login:', !!sessionData.session)
      
      if (!sessionData.session) {
        setDebugInfo('Login succeeded but no session was created')
        throw new Error('No session created after login')
      }
      
      toast({
        title: 'Success',
        description: 'You have been logged in successfully.',
      })
      
      // Add a small delay to ensure cookies are set
      setTimeout(() => {
        // Force a hard navigation to the dashboard
        window.location.href = '/dashboard'
      }, 500)
    } catch (error: any) {
      console.error('Caught error:', error)
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message || 'An error occurred during login',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
      
      {debugInfo && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          <p className="font-semibold">Debug Information:</p>
          <p>{debugInfo}</p>
        </div>
      )}
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={async () => {
            try {
              setDebugInfo(null)
              const { data, error } = await supabase.auth.getSession()
              if (error) throw error
              setDebugInfo(`Current session: ${JSON.stringify({
                hasSession: !!data.session,
                email: data.session?.user?.email,
              })}`)
            } catch (error: any) {
              setDebugInfo(`Error checking session: ${error.message}`)
            }
          }}
        >
          Check Current Session
        </Button>
      </div>
    </div>
  )
}