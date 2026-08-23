import { ArrowLeftIcon, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { LoginTestDetails } from "@/lib/auth/test-details"

type LoginPageShellProps = {
  badge: string
  description: string
  destination: string
  endpoint: string
  icon: LucideIcon
  signupHref?: string | null
  signupLabel?: string
  testDetails?: LoginTestDetails | null
  title: string
}

export function LoginPageShell({
  badge,
  description,
  destination,
  endpoint,
  icon: Icon,
  signupHref,
  signupLabel,
  testDetails,
  title,
}: LoginPageShellProps) {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/30 p-6">
      <div className="absolute inset-x-0 top-0 h-48 bg-primary/8" />
      <div className="relative w-full max-w-md space-y-4">
        <Button nativeButton={false} variant="ghost" render={<Link href="/" />}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to FoodIO
        </Button>

        <Card className="border border-border/70 shadow-xl shadow-foreground/5">
          <CardHeader className="gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <Badge variant="secondary">{badge}</Badge>
            </div>
            <div className="space-y-1.5">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <LoginForm
              endpoint={endpoint}
              returnTo={destination}
              signupHref={signupHref}
              signupLabel={signupLabel}
              testDetails={testDetails}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
