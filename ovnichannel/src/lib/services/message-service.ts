// src/lib/services/message-service.ts
import { supabase } from "@/lib/supabase/client";

interface SendMessageParams {
  conversationId: string;
  content: string;
  attachments?: Array<{ url: string; type: string; name: string }>;
}

export async function sendMessage({ conversationId, content, attachments = [] }: SendMessageParams) {
  try {
    // Primero, crear el mensaje en la base de datos local
    const { data: message, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_type: "agent",
        content,
        has_attachments: attachments.length > 0,
        status: "pending",
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Luego, enviar a través de la API
    const response = await fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId,
        messageText: content,
        attachments,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error sending message");
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error in message service:", error);
    throw error;
  }
}