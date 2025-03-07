import { getUserDetails } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ConversationList } from "@/components/conversations/conversation-list"
import { EmptyState } from "@/components/empty-state"

export default async function ConversationsPage() {
  const user = await getUserDetails()

  if (!user) {
    return <div>Loading user information...</div>
  }

  const supabase = await createServerSupabaseClient()

  // Get all conversations for the user
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .eq("user_id", user.id)
    .order("last_message_time", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Conversations</h1>
        <p className="text-muted-foreground">Manage all your ongoing conversations across channels.</p>
      </div>

      {conversations && conversations.length > 0 ? (
        <ConversationList conversations={conversations} />
      ) : (
        <EmptyState
          title="No conversations yet"
          description="Connect a channel to start receiving messages."
          action={{
            label: "Connect Channel",
            href: "/connections",
          }}
        />
      )}
    </div>
  )
}

