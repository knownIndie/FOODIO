import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type PortalPlaceholderProps = {
  description: string
  icon: LucideIcon
  label: string
  title: string
  username: string
}

export function PortalPlaceholder({
  description,
  icon: Icon,
  label,
  title,
  username,
}: PortalPlaceholderProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-6">
      <div className="space-y-2">
        <Badge variant="secondary">{label}</Badge>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="max-w-2xl text-muted-foreground">{description}</p>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <CardTitle>Signed in as @{username}</CardTitle>
          <CardDescription>
            You reached the correct {label.toLowerCase()} route.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Portal tools will be added here later. This page currently verifies
            routing and access only.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
