// src/components/connections/connections-list.tsx
"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Facebook, Instagram, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SocialAccount {
  id: string;
  platform: string;
  platform_name: string;
  platform_username: string;
  created_at: string;
}

interface ConnectionsListProps {
  initialConnections: SocialAccount[];
}

export function ConnectionsList({ initialConnections }: ConnectionsListProps) {
  const [connections, setConnections] = useState<SocialAccount[]>(initialConnections);
  const queryClient = useQueryClient();
  
  const { data } = useQuery({
    queryKey: ["social-accounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_accounts")
        .select("*");
      
      if (error) throw error;
      return data as SocialAccount[];
    },
    initialData: initialConnections,
  });
  
  useEffect(() => {
    if (data) {
      setConnections(data);
    }
  }, [data]);
  
  const deleteConnection = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("social_accounts")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
    },
  });
  
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case "instagram":
        return <Instagram className="h-5 w-5 text-purple-600" />;
      case "whatsapp":
        return <MessageCircle className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };
  
  if (!connections.length) {
    return null;
  }
  
  return (
    <div className="mt-4 space-y-4">
      {connections.map((connection) => {
        const formattedDate = format(
          new Date(connection.created_at),
          "d 'de' MMMM 'de' yyyy",
          { locale: es }
        );
        
        return (
          <Card key={connection.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                {getPlatformIcon(connection.platform)}
                <div>
                  <h3 className="font-medium">
                    {connection.platform_name || connection.platform_username}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Conectado el {formattedDate}
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción desconectará tu cuenta de {connection.platform}. 
                      Ya no recibirás mensajes de esta plataforma.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteConnection.mutate(connection.id)}
                    >
                      Desconectar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}