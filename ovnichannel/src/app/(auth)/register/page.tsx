// app/(auth)/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/icons'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

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
      console.log('Attempting registration with:', { email: formData.email, name: formData.name })
      
      // Create the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          },
        },
      })

      if (authError) {
        console.error('Registration auth error:', authError)
        setDebugInfo(`Auth Error: ${authError.message} (${authError.status})`)
        throw authError
      }

      console.log('Auth registration successful:', authData)

      if (authData.user) {
        // Create a profile for the user
        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          name: formData.name,
          email: formData.email,
        })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          setDebugInfo(`Profile Error: ${profileError.message}`)
          throw profileError
        }

        toast({
          title: 'Account created',
          description: 'Your account has been created successfully.',
        })

        // Force a hard navigation to the dashboard
        window.location.href = '/dashboard'
      } else {
        setDebugInfo('User was created but no user object was returned')
        throw new Error('Registration failed - no user returned')
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'An error occurred during registration',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">Enter your information to create an account</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
            value={formData.password}
            onChange={handleChange}
          />
          <p className="text-xs text-muted-foreground">Password must be at least 6 characters long</p>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            'Sign Up'
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
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}