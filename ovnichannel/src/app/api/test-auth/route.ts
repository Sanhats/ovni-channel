// app/api/test-auth/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Missing Supabase credentials' }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Check if auth is working
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    // Check if we can access the database
    const { data: dbData, error: dbError } = await supabase.from('profiles').select('count').limit(1)
    
    return NextResponse.json({
      supabaseUrl,
      authStatus: authError ? `Error: ${authError.message}` : 'OK',
      dbStatus: dbError ? `Error: ${dbError.message}` : 'OK',
      authData: authData || null,
      dbData: dbData || null
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}