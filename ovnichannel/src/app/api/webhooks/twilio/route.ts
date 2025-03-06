// src/app/api/webhooks/twilio/route.ts
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // Verificar que la solicitud viene de Twilio
  // En una implementación real, deberías validar la firma de Twilio
  
  const formData = await request.formData();
  const body = Object.fromEntries(formData.entries());
  
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    // Extraer datos del mensaje de WhatsApp
    const from = body.From as string; // Formato: whatsapp:+1234567890
    const to = body.To as string; // Formato: whatsapp:+1234567890
    const messageText = body.Body as string;
    const mediaUrl = body.MediaUrl0 as string | undefined;
    const messageId = body.MessageSid as string;
    
    // Extraer números de teléfono sin el prefijo "whatsapp:"
    const customerPhone = from.replace('whatsapp:', '');
    const ourPhone = to.replace('whatsapp:', '');
    
    // Buscar el usuario asociado con este número de WhatsApp
    const { data: socialAccount, error: socialAccountError } = await supabase
      .from("social_accounts")
      .select("user_id")
      .eq("platform", "whatsapp")
      .eq("platform_username", ourPhone)
      .single();
    
    if (socialAccountError || !socialAccount) {
      return NextResponse.json(
        { error: 'No user found for this WhatsApp number' },
        { status: 404 }
      );
    }
    
    const userId = socialAccount.user_id;
    
    // Buscar o crear el cliente
    let customerId;
    
    const { data: existingCustomer, error: customerError } = await supabase
      .from("customers")
      .select("id")
      .eq("user_id", userId)
      .eq("platform", "whatsapp")
      .eq("phone", customerPhone)
      .single();
    
    if (customerError || !existingCustomer) {
      // Crear nuevo cliente
      const { data: newCustomer, error: newCustomerError } = await supabase
        .from("customers")
        .insert({
          user_id: userId,
          platform: "whatsapp",
          phone: customerPhone,
          platform_customer_id: customerPhone,
        })
        .select()
        .single();
      
      if (newCustomerError) {
        return NextResponse.json(
          { error: 'Failed to create customer' },
          { status: 500 }
        );
      }
      
      customerId = newCustomer.id;
    } else {
      customerId = existingCustomer.id;
    }
    
    // Buscar o crear la conversación
    let conversationId;
    
    const { data: existingConversation, error: conversationError } = await supabase
      .from("conversations")
      .select("id")
      .eq("user_id", userId)
      .eq("customer_id", customerId)
      .eq("platform", "whatsapp")
      .single();
    
    if (conversationError || !existingConversation) {
      // Crear nueva conversación
      const { data: newConversation, error: newConversationError } = await supabase
        .from("conversations")
        .insert({
          user_id: userId,
          customer_id: customerId,
          platform: "whatsapp",
          status: "open",
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();
      
      if (newConversationError) {
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }
      
      conversationId = newConversation.id;
    } else {
      conversationId = existingConversation.id;
      
      // Actualizar estado de la conversación si estaba cerrada
      await supabase
        .from("conversations")
        .update({
          status: "open",
          last_message_at: new Date().toISOString(),
        })
        .eq("id", conversationId);
    }
    
    // Crear el mensaje
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_type: "customer",
        content: messageText,
        has_attachments: !!mediaUrl,
        status: "received",
        external_id: messageId,
      })
      .select()
      .single();
    
    if (messageError) {
      return NextResponse.json(
        { error: 'Failed to create message' },
        { status: 500 }
      );
    }
    
    // Si hay una URL de medios, guardarla como adjunto
    if (mediaUrl) {
      // En una implementación real, aquí guardarías la información del adjunto
      console.log(`Media URL received: ${mediaUrl}`);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error processing Twilio webhook:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}