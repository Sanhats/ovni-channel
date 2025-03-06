"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Conversation } from "@/types"

interface ConversationsSummaryProps {
  conversations: Conversation[]
}

export function ConversationsSummary({ conversations }: ConversationsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Conversations</CardTitle>
        <CardDescription>Your most recent conversations across all channels</CardDescription>
      </CardHeader>
      <CardContent>
        {conversations.length > 0 ? (
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <div className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{conversation.participant_name || conversation.participant_id}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message || "No messages yet"}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {conversation.last_message_time ? new Date(conversation.last_message_time).toLocaleDateString() : ""}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent conversations</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

