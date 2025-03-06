"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import type { Conversation } from "@/types"

interface ConversationListProps {
  conversations: Conversation[]
}

export function ConversationList({ conversations }: ConversationListProps) {
  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <Link key={conversation.id} href={`/conversations/${conversation.id}`}>
          <Card className="hover:bg-accent/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={conversation.participant_avatar} />
                  <AvatarFallback>
                    {(conversation.participant_name || conversation.participant_id)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{conversation.participant_name || conversation.participant_id}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message || "No messages yet"}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                  {conversation.last_message_time ? new Date(conversation.last_message_time).toLocaleDateString() : ""}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

