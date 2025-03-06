// src/components/connections/connections-list.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

interface SocialAccount {
  id: string;
  platform: string;
  platform_name?: string;
  platform_username?: string;
  created_at: string;
}

interface ConnectionsListProps {
  initialConnections: SocialAccount[];
}

export function ConnectionsList({ initialConnections = [] }: ConnectionsListProps) {
  const [connections] = useState<SocialAccount[]>(initialConnections);
  
  if (!connections.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            No tienes cuentas conectadas. Conecta tus cuentas de redes sociales para empezar.
          </p>
        </CardContent>
      </Card>
    );
  }
  
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
  
  return (
    <div className="mt-4 space-y-4">
      {connections.map((connection) => (
        <Card key={connection.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {getPlatformIcon(connection.platform)}
              <div>
                <h3 className="font-medium">
                  {connection.platform_name || connection.platform_username || connection.platform}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Conectado el {new Date(connection.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}