// lib/auth-actions.ts
'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "./supabase/server"

export async function getSessionAction() {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.error("Error getting session:", error)
      return null
    }
    return data.session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function signOutAction() {
  const cookieStore = cookies()
  const supabase = await createServerSupabaseClient()
  
  try {
    await supabase.auth.signOut()
    // Manually clear the auth cookie
    cookieStore.set({
      name: 'sb-auth-token',
      value: '',
      expires: new Date(0),
      path: '/'
    })
    
    // Also try to clear the specific Supabase cookie
    const supabaseCookieName = cookieStore.getAll()
      .find(cookie => cookie.name.includes('supabase'))?.name
      
    if (supabaseCookieName) {
      cookieStore.set({
        name: supabaseCookieName,
        value: '',
        expires: new Date(0),
        path: '/'
      })
    }
  } catch (error) {
    console.error("Error signing out:", error)
  }
  
  redirect('/login')
}