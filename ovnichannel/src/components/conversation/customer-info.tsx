// src/components/conversation/customer-info.tsx
"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Edit2, Mail, Phone, Save, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import type { Customer } from "@/types";

interface CustomerInfoProps {
  customer: Customer;
}

export function CustomerInfo({ customer }: CustomerInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: customer.name || "",
    email: customer.email || "",
    phone: customer.phone || "",
    notes: customer.notes || "",
  });
  
  const queryClient = useQueryClient();
  
  const updateCustomer = useMutation({
    mutationFn: async (data: typeof customerData) => {
      const { error } = await supabase
        .from("customers")
        .update(data)
        .eq("id", customer.id);
      
      if (error) throw error;
      return { ...customer, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", customer.id] });
      setIsEditing(false);
    },
  });
  
  const handleSave = () => {
    updateCustomer.mutate(customerData);
  };
  
  const handleCancel = () => {
    setCustomerData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      notes: customer.notes || "",
    });
    setIsEditing(false);
  };
  
  const createdAt = format(
    new Date(customer.created_at),
    "d 'de' MMMM 'de' yyyy",
    { locale: es }
  );
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
        <CardTitle>Información del cliente</CardTitle>
        {isEditing ? (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={updateCustomer.isPending}
            >
              <X className="mr-1 h-4 w-4" />
              Cancelar
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={updateCustomer.isPending}
            >
              <Save className="mr-1 h-4 w-4" />
              Guardar
            </Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="mr-1 h-4 w-4" />
            Editar
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={customer.avatar_url || ""} alt={customer.name || "Cliente"} />
            <AvatarFallback className="text-lg">
              {customer.name?.charAt(0) || "C"}
            </AvatarFallback>
          </Avatar>
          
          {isEditing ? (
            <div className="w-full space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={customerData.email}
                  onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={customerData.notes}
                  onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-medium">{customer.name || "Cliente sin nombre"}</h3>
                <p className="text-sm text-muted-foreground">Cliente desde {createdAt}</p>
              </div>
              
              <div className="w-full space-y-2">
                {customer.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.email}</span>
                  </div>
                )}
                
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>
              
              {customer.notes && (
                <div className="w-full rounded-lg bg-muted p-4 text-left">
                  <h4 className="mb-2 font-medium">Notas</h4>
                  <p className="text-sm">{customer.notes}</p>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}