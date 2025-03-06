// src/components/conversation/conversation-card.tsx
"use client";

import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

interface ConversationCardProps {
  conversation: Conversation;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
  const { id, customer, platform, status, last_message_at, messages } = conversation;
  
  // Obtener el último mensaje
  const lastMessage = messages && messages.length > 0 
    ? messages[messages.length - 1] 
    : null;
  
  // Formatear la fecha del último mensaje
  const formattedDate = last_message_at 
    ? format(new Date(last_message_at), "d MMM, HH:mm", { locale: es }) 
    : "";
  
  // Determinar el color del badge según la plataforma
  const platformColor = {
    facebook: "bg-blue-100 text-blue-800",
    instagram: "bg-purple-100 text-purple-800",
    whatsapp: "bg-green-100 text-green-800",
  }[platform];
  
  // Determinar el color del badge según el estado
  const statusColor = {
    open: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    closed: "bg-gray-100 text-gray-800",
  }[status];
  
  return (
    <Link href={`/conversations/${id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={customer?.avatar_url || ""} alt={customer?.name || "Cliente"} />
              <AvatarFallback>
                {customer?.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{customer?.name || "Cliente sin nombre"}</h3>
                <span className="text-xs text-muted-foreground">{formattedDate}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {lastMessage?.content || "No hay mensajes"}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline" className={cn("text-xs", platformColor)}>
                  {platform}
                </Badge>
                <Badge variant="outline" className={cn("text-xs", statusColor)}>
                  {status === "open" ? "Abierto" : status === "pending" ? "Pendiente" : "Cerrado"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}