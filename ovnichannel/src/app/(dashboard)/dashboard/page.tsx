import { getUserDetails } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConversationsSummary } from "@/components/dashboard/conversations-summary"
import { ChannelsSummary } from "@/components/dashboard/channels-summary"
import { RecentMessages } from "@/components/dashboard/recent-messages"

export default async function DashboardPage() {
  const user = await getUserDetails()
  const supabase = createServerSupabaseClient()

  if (!user) {
    return <div>Loading user information...</div>
  }

  // Get total conversations count
  const { count: conversationsCount } = await supabase
    .from("conversations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Get total channels count
  const { count: channelsCount } = await supabase
    .from("channels")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Get recent conversations
  const { data: recentConversations } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("last_message_time", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.profile?.name || user.email}! Here's your messaging overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Conversations</CardTitle>
            <CardDescription>Across all channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{conversationsCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Connected Channels</CardTitle>
            <CardDescription>Active integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{channelsCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Unread Messages</CardTitle>
            <CardDescription>Messages requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ConversationsSummary conversations={recentConversations || []} />
        <ChannelsSummary channels={[]} />
      </div>

      <RecentMessages />
    </div>
  )
}

