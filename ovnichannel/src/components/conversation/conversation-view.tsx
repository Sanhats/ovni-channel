// src/components/conversation/conversation-view.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Conversation, Message } from "@/types";

interface ConversationViewProps {
  conversation: Conversation;
}

export function ConversationView({ conversation }: ConversationViewProps) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(conversation.messages || []);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  // Ordenar mensajes por fecha
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  
  // Scroll al final de los mensajes cuando se cargan o se envía uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Suscribirse a nuevos mensajes
  useEffect(() => {
    const channel = supabase
      .channel(`conversation-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id]);
  
  // Mutación para enviar un mensaje
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversation.id,
          sender_type: "agent",
          content,
          status: "pending",
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Actualizar la caché de React Query
      queryClient.invalidateQueries({ queryKey: ["conversation", conversation.id] });
      
      // Actualizar la última fecha de mensaje de la conversación
      supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversation.id);
      
      // Limpiar el campo de texto
      setNewMessage("");
      
      // Aquí se simula el envío a la plataforma externa
      // En una implementación real, esto se haría a través de una API
      setTimeout(() => {
        supabase
          .from("messages")
          .update({ status: "sent" })
          .eq("id", data.id);
      }, 1000);
    },
  });
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    try {
      setIsSending(true);
      await sendMessage({
        conversationId: conversation.id,
        content: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Error al enviar el mensaje");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Card className="flex h-[calc(100vh-13rem)] flex-col">
      <CardHeader className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{conversation.customer?.name || "Cliente"}</CardTitle>
            <Badge variant="outline" className={cn(
              "text-xs",
              conversation.platform === "facebook" ? "bg-blue-100 text-blue-800" :
              conversation.platform === "instagram" ? "bg-purple-100 text-purple-800" :
              "bg-green-100 text-green-800"
            )}>
              {conversation.platform}
            </Badge>
          </div>
          <Badge variant="outline" className={cn(
            "text-xs",
            conversation.status === "open" ? "bg-green-100 text-green-800" :
            conversation.status === "pending" ? "bg-yellow-100 text-yellow-800" :
            "bg-gray-100 text-gray-800"
          )}>
            {conversation.status === "open" ? "Abierto" : 
             conversation.status === "pending" ? "Pendiente" : "Cerrado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {sortedMessages.map((message) => {
            const isCustomer = message.sender_type === "customer";
            const messageDate = format(
              new Date(message.created_at),
              "d MMM, HH:mm",
              { locale: es }
            );
            
            return (
              <div
                key={message.id}
                className={cn(
                  "flex items-end gap-2",
                  isCustomer ? "justify-start" : "justify-end"
                )}
              >
                {isCustomer && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={conversation.customer?.avatar_url || ""}
                      alt={conversation.customer?.name || "Cliente"}
                    />
                    <AvatarFallback>
                      {conversation.customer?.name?.charAt(0) || "C"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-lg px-4 py-2",
                    isCustomer
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p>{message.content}</p>
                  <p className={cn(
                    "mt-1 text-right text-xs",
                    isCustomer ? "text-muted-foreground" : "text-primary-foreground/80"
                  )}>
                    {messageDate}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
          <Textarea
            placeholder="Escribe un mensaje..."
            className="min-h-10 flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={sendMessage.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}