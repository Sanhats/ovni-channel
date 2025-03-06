"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentMessages() {
  // This would typically fetch the most recent messages across all conversations
  const recentMessages: any[] = []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Messages</CardTitle>
        <CardDescription>Your most recent messages across all conversations</CardDescription>
      </CardHeader>
      <CardContent>
        {recentMessages.length > 0 ? (
          <div className="space-y-4">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <div className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{message.sender_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent messages</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

