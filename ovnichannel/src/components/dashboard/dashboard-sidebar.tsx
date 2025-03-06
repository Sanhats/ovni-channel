// src/components/dashboard/dashboard-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, LinkIcon, Settings, BarChart } from 'lucide-react';

export function DashboardSidebar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: BarChart,
    },
    {
      href: "/conversations",
      label: "Conversaciones",
      icon: MessageSquare,
    },
    {
      href: "/customers",
      label: "Clientes",
      icon: Users,
    },
    {
      href: "/connections",
      label: "Conexiones",
      icon: LinkIcon,
    },
    {
      href: "/settings",
      label: "Configuración",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r bg-background md:flex">
      <div className="flex flex-col gap-2 p-4">
        {routes.map((route) => (
          <Button
            key={route.href}
            variant={pathname === route.href || pathname.startsWith(`${route.href}/`) ? "default" : "ghost"}
            className={cn(
              "justify-start",
              pathname === route.href || pathname.startsWith(`${route.href}/`) ? "" : "text-muted-foreground"
            )}
            asChild
          >
            <Link href={route.href}>
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Link>
          </Button>
        ))}
      </div>
    </aside>
  );
}