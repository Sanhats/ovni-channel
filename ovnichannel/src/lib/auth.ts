"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "./supabase/server"

export async function signOut() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  cookies().delete("supabase-auth-token")
  redirect("/login")
}

export async function getSession() {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      throw error
    }
    return data.session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function getUserDetails() {
  const supabase = createServerSupabaseClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return null
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    return {
      ...user,
      profile,
    }
  } catch (error) {
    console.error("Error getting user details:", error)
    return null
  }
}

