// lib/auth.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from './supabase/server'

export async function signOut() {
  try {
    console.log('Signing out user...')
    const supabase = await createServerSupabaseClient()
    await supabase.auth.signOut()
    cookies().delete('supabase-auth-token')
    console.log('User signed out successfully')
    redirect('/login')
  } catch (error) {
    console.error('Error signing out:', error)
    redirect('/login')
  }
}

export async function getSession() {
  try {
    console.log('Getting session...')
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    console.log('Session retrieved:', !!data.session)
    return data.session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

export async function getUserDetails() {
  try {
    console.log('Getting user details...')
    const supabase = await createServerSupabaseClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Error getting user:', userError)
      return null
    }
    
    console.log('User found:', user.id)
    
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.error('Error getting profile:', profileError)
    }
    
    return {
      ...user,
      profile
    }
  } catch (error) {
    console.error('Error getting user details:', error)
    return null
  }
}