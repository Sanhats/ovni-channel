import { getUserDetails } from "@/lib/auth"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ChannelList } from "@/components/connections/channel-list"
import { NewConnectionButton } from "@/components/connections/new-connection-button"
import { EmptyState } from "@/components/empty-state"

export default async function ConnectionsPage() {
  const user = await getUserDetails()

  if (!user) {
    return <div>Loading user information...</div>
  }

  const supabase = createServerSupabaseClient()

  // Get all channels for the user
  const { data: channels } = await supabase
    .from("channels")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Connections</h1>
          <p className="text-muted-foreground">Connect and manage your messaging channels.</p>
        </div>
        <NewConnectionButton />
      </div>

      {channels && channels.length > 0 ? (
        <ChannelList channels={channels} />
      ) : (
        <EmptyState
          title="No connections yet"
          description="Connect your first messaging channel to get started."
          action={{
            label: "Connect Channel",
            href: "#",
            onClick: true,
          }}
        />
      )}
    </div>
  )
}

