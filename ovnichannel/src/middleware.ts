import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  try {
    console.log("Middleware running for path:", request.nextUrl.pathname)

    // Create a response object that we'll modify and return
    const res = NextResponse.next()

    // Create the Supabase client
    const supabase = createMiddlewareClient({ req: request, res })

    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log("Middleware session check:", !!session, session?.user?.email)

    // If accessing a protected route without a session, redirect to login
    const isProtectedRoute =
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/conversations") ||
      request.nextUrl.pathname.startsWith("/connections") ||
      request.nextUrl.pathname.startsWith("/settings")

    const isAuthRoute =
      request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")

    // For debugging - add a custom header with auth status
    res.headers.set("x-auth-status", session ? "authenticated" : "unauthenticated")

    if (isProtectedRoute && !session) {
      console.log("Middleware: Protected route accessed without session, redirecting to login")
      const redirectUrl = new URL("/login", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    if (session && isAuthRoute) {
      console.log("Middleware: Auth route accessed with session, redirecting to dashboard")
      const redirectUrl = new URL("/dashboard", request.url)
      return NextResponse.redirect(redirectUrl)
    }

    // Return the response with the session
    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // Continue to the requested resource in case of error
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/conversations/:path*",
    "/connections/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
}

