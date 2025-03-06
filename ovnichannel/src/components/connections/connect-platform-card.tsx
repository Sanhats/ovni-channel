// src/components/connections/connect-platform-card.tsx
"use client";

import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ConnectPlatformCardProps {
  platform: "facebook" | "instagram" | "whatsapp";
  title: string;
  description: string;
  connected: boolean;
}

export function ConnectPlatformCard({
  platform,
  title,
  description,
  connected,
}: ConnectPlatformCardProps) {
  const PlatformIcon = {
    facebook: Facebook,
    instagram: Instagram,
    whatsapp: MessageCircle,
  }[platform];
  
  const platformColor = {
    facebook: "text-blue-600",
    instagram: "text-purple-600",
    whatsapp: "text-green-600",
  }[platform];
  
  const handleConnect = () => {
    alert(`Conectando a ${platform}... Esta funcionalidad se implementará próximamente.`);
  };
  
  const handleOpenSettings = () => {
    alert(`Abriendo configuración de ${platform}... Esta funcionalidad se implementará próximamente.`);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <PlatformIcon className={`h-6 w-6 ${platformColor}`} />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              connected ? "bg-green-500" : "bg-gray-300"
            }`}
          />
          <span className="text-sm">
            {connected ? "Conectado" : "No conectado"}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        {connected ? (
          <Button variant="outline" onClick={handleOpenSettings}>
            Configuración
          </Button>
        ) : (
          <Button onClick={handleConnect}>Conectar</Button>
        )}
      </CardFooter>
    </Card>
  );
}