"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function NewConnectionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const providers = [
    {
      name: "Email",
      description: "Connect your email account",
      integration: "SMTP",
    },
    {
      name: "SMS",
      description: "Connect SMS provider",
      integration: "Twilio",
    },
    {
      name: "WhatsApp",
      description: "Connect WhatsApp Business API",
      integration: "WhatsApp API",
    },
    {
      name: "Messenger",
      description: "Connect Facebook Messenger",
      integration: "Facebook API",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icons.plus className="mr-2 h-4 w-4" />
          Add Connection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect a new channel</DialogTitle>
          <DialogDescription>Choose a messaging channel to connect to your dashboard.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 md:grid-cols-2">
          {providers.map((provider) => (
            <Card key={provider.name} className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-2">
                <CardTitle>{provider.name}</CardTitle>
                <CardDescription>{provider.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">Integration: {provider.integration}</p>
              </CardContent>
              <CardFooter>
                <Button size="sm" className="w-full">
                  Connect
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

