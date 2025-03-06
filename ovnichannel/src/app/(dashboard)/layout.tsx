import type React from "react"
import { redirect } from "next/navigation"
import { ReactQueryProvider } from "@/components/providers/react-query-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { getSession } from "@/lib/auth"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <ReactQueryProvider>
      <AuthProvider initialSession={session}>
        <div className="flex h-screen flex-col">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4">{children}</main>
          </div>
        </div>
      </AuthProvider>
    </ReactQueryProvider>
  )
}

