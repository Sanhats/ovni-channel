import Link from "next/link"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title: string
  description: string
  action?: {
    label: string
    href: string
    onClick?: boolean
  }
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">{description}</p>
        {action &&
          (action.onClick ? (
            <Button asChild>
              <span>{action.label}</span>
            </Button>
          ) : (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
      </div>
    </div>
  )
}

