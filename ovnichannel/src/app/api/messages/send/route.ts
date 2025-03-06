// src/app/api/messages/send/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import twilio from 'twilio';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { conversationId, messageText, attachments = [] } = await request.json();
  
  // Inicializar cliente de Supabase
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Obtener detalles de la conversación
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select(`
        *,
        customer:customers(*)
      `)
      .eq("id", conversationId)
      .single();
    
    if (conversationError || !conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }
    
    // Crear mensaje en nuestra base de datos
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_type: "agent",
        content: messageText,
        has_attachments: attachments.length > 0,
        status: "pending",
      })
      .select()
      .single();
    
    if (messageError) {
      return NextResponse.json(
        { error: messageError.message },
        { status: 500 }
      );
    }
    
    // Enviar a la plataforma correspondiente
    let externalResponse;
    
    switch (conversation.platform) {
      case 'facebook':
        externalResponse = await sendFacebookMessage(conversation, messageText, attachments);
        break;
      case 'instagram':
        externalResponse = await sendInstagramMessage(conversation, messageText, attachments);
        break;
      case 'whatsapp':
        externalResponse = await sendWhatsAppMessage(conversation, messageText, attachments);
        break;
      default:
        return NextResponse.json(
          { error: `Platform not supported: ${conversation.platform}` },
          { status: 400 }
        );
    }
    
    // Actualizar estado del mensaje
    await supabase
      .from("messages")
      .update({
        status: "sent",
        external_id: externalResponse?.id || null,
      })
      .eq("id", message.id);
    
    // Actualizar la última fecha de mensaje de la conversación
    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", conversationId);
    
    return NextResponse.json({ message, externalResponse });
    
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function sendWhatsAppMessage(conversation: any, messageText: string, attachments: any[]) {
  // En una implementación real, esto usaría las credenciales de Twilio
  // Para este ejemplo, simulamos una respuesta exitosa
  
  // const client = twilio(
  //   process.env.TWILIO_ACCOUNT_SID,
  //   process.env.TWILIO_AUTH_TOKEN
  // );
  
  // let messageOptions = {
  //   from: `whatsapp:${conversation.our_number}`,
  //   to: `whatsapp:${conversation.customer.phone}`,
  //   body: messageText,
  // };
  
  // if (attachments.length > 0) {
  //   messageOptions.mediaUrl = attachments.map(a => a.url);
  // }
  
  // return await client.messages.create(messageOptions);
  
  // Simulación
  return {
    id: `whatsapp-msg-${Date.now()}`,
    status: "sent",
    timestamp: new Date().toISOString(),
  };
}

async function sendFacebookMessage(conversation: any, messageText: string, attachments: any[]) {
  // Simulación
  return {
    id: `fb-msg-${Date.now()}`,
    status: "sent",
    timestamp: new Date().toISOString(),
  };
}

async function sendInstagramMessage(conversation: any, messageText: string, attachments: any[]) {
  // Simulación
  return {
    id: `ig-msg-${Date.now()}`,
    status: "sent",
    timestamp: new Date().toISOString(),
  };
}