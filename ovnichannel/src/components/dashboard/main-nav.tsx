// src/components/dashboard/main-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-context";

export function MainNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-6 md:gap-10">
        <Link href="/dashboard" className="font-bold">
          OvniChannel
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link
            href="/dashboard"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Dashboard
          </Link>
          <Link
            href="/conversations"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/conversations") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Conversaciones
          </Link>
          <Link
            href="/customers"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/customers") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Clientes
          </Link>
          <Link
            href="/connections"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith("/connections") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Conexiones
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}