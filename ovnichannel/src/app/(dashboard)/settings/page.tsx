import { getUserDetails } from "@/lib/auth"
import { ProfileForm } from "@/components/settings/profile-form"

export default async function SettingsPage() {
  const user = await getUserDetails()

  if (!user) {
    return <div>Loading user information...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      <div className="space-y-6">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}

