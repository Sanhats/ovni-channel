// src/hooks/use-conversations.ts
import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { Conversation, ConversationFilters } from '@/types';

export function useConversations() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<ConversationFilters>({});
  
  const fetchConversations = useCallback(async (filterParams: ConversationFilters = {}) => {
    let query = supabase
      .from('conversations')
      .select(`
        *,
        customer:customers(*),
        messages:messages(*)
      `)
      .order('last_message_at', { ascending: false });
    
    // Aplicar filtros
    if (filterParams.platform) {
      query = query.eq('platform', filterParams.platform);
    }
    
    if (filterParams.status) {
      query = query.eq('status', filterParams.status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data as Conversation[];
  }, []);
  
  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['conversations', filters],
    queryFn: () => fetchConversations(filters),
  });
  
  const updateConversation = useMutation({
    mutationFn: async (updates: Partial<Conversation> & { id: string }) => {
      const { id, ...updateData } = updates;
      const { data, error } = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['conversation', data.id] });
    },
  });
  
  return {
    conversations,
    isLoading,
    error,
    filters,
    setFilters,
    updateConversation,
  };
}