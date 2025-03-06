// src/app/(dashboard)/conversations/[id]/page.tsx
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ConversationView } from "@/components/conversation/conversation-view";
import { CustomerInfo } from "@/components/conversation/customer-info";

interface ConversationPageProps {
  params: {
    id: string;
  };
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { id } = params;
  const supabase = createServerSupabaseClient();
  
  // Obtener la conversación con sus mensajes y cliente
  const { data: conversation, error } = await supabase
    .from("conversations")
    .select(`
      *,
      customer:customers(*),
      messages(*)
    `)
    .eq("id", id)
    .single();
  
  if (error || !conversation) {
    notFound();
  }
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <ConversationView conversation={conversation} />
      </div>
      <div>
        <CustomerInfo customer={conversation.customer} />
      </div>
    </div>
  );
}