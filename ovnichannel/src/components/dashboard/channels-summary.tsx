"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Channel } from "@/types"

interface ChannelsSummaryProps {
  channels: Channel[]
}

export function ChannelsSummary({ channels }: ChannelsSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Channels</CardTitle>
        <CardDescription>Your active messaging channel integrations</CardDescription>
      </CardHeader>
      <CardContent>
        {channels.length > 0 ? (
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <div className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{channel.name}</p>
                  <p className="text-sm text-muted-foreground">{channel.provider}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No channels connected</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

