"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Channel } from "@/types"

interface ChannelListProps {
  channels: Channel[]
}

export function ChannelList({ channels }: ChannelListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {channels.map((channel) => (
        <Card key={channel.id}>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-primary/10 p-4">
                <div className="h-10 w-10" />
              </div>
              <h3 className="font-semibold">{channel.name}</h3>
              <p className="text-sm text-muted-foreground">{channel.provider}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm">
              Configure
            </Button>
            <Button variant="destructive" size="sm">
              Disconnect
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

