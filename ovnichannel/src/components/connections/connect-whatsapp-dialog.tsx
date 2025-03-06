// src/components/connections/connect-whatsapp-dialog.tsx
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ConnectWhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConnectWhatsAppDialog({
  open,
  onOpenChange,
}: ConnectWhatsAppDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<"phone" | "verification">("phone");
  const queryClient = useQueryClient();
  
  const requestVerification = useMutation({
    mutationFn: async (phone: string) => {
      // En una implementación real, esto llamaría a una API para solicitar
      // la verificación a través de Twilio
      // Simulamos una respuesta exitosa
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Código de verificación enviado a tu WhatsApp");
      setStep("verification");
    },
    onError: () => {
      toast.error("Error al enviar el código de verificación");
    },
  });
  
  const verifyAndConnect = useMutation({
    mutationFn: async () => {
      // En una implementación real, esto verificaría el código
      // y conectaría la cuenta de WhatsApp
      
      // Simulamos una conexión exitosa
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) throw new Error("Usuario no autenticado");
      
      const { data, error } = await supabase
        .from("social_accounts")
        .insert({
          user_id: user.user.id,
          platform: "whatsapp",
          platform_id: phoneNumber,
          access_token: "simulated-token",
          platform_username: phoneNumber,
          platform_name: "WhatsApp Business",
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("WhatsApp conectado correctamente");
      queryClient.invalidateQueries({ queryKey: ["social-accounts"] });
      onOpenChange(false);
      setStep("phone");
      setPhoneNumber("");
      setVerificationCode("");
    },
    onError: () => {
      toast.error("Error al conectar WhatsApp");
    },
  });
  
  const handleRequestVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    
    requestVerification.mutate(phoneNumber);
  };
  
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) return;
    
    verifyAndConnect.mutate();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-green-600" />
            <DialogTitle>Conectar WhatsApp</DialogTitle>
          </div>
          <DialogDescription>
            Conecta tu número de WhatsApp Business para gestionar tus conversaciones.
          </DialogDescription>
        </DialogHeader>
        
        {step === "phone" ? (
          <form onSubmit={handleRequestVerification}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Número de teléfono</Label>
                <Input
                  id="phone"
                  placeholder="+34600000000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Introduce tu número de WhatsApp Business con el código de país.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={!phoneNumber || requestVerification.isPending}
              >
                {requestVerification.isPending
                  ? "Enviando código..."
                  : "Enviar código de verificación"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de verificación</Label>
                <Input
                  id="code"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Introduce el código de verificación que recibiste en WhatsApp.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setStep("phone")}
                disabled={verifyAndConnect.isPending}
              >
                Volver
              </Button>
              <Button
                type="submit"
                disabled={!verificationCode || verifyAndConnect.isPending}
              >
                {verifyAndConnect.isPending
                  ? "Verificando..."
                  : "Verificar y conectar"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}