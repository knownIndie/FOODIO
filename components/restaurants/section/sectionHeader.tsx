import { CheckIcon, CircleIcon, LockKeyholeIcon, StoreIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  type RestaurantSetupProgress,
  restaurantSetupSections,
} from "@/lib/restaurants/restaurant-extra"

type SectionHeaderProps = {
  restaurantName: string
  restaurantStatus: string
  setup: RestaurantSetupProgress
  completed: number
  total: number
  current: string
}

export default function SectionHeader({
  restaurantName,
  restaurantStatus,
  setup,
  completed,
  total,
  current,
}: SectionHeaderProps) {
  return (
    <header className="w-full space-y-5 rounded-[min(var(--radius-4xl),24px)] bg-card p-5 shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <StoreIcon className="size-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Restaurant onboarding
            </p>
            <h1 className="max-w-3xl text-balance font-heading text-xl font-semibold tracking-tight sm:text-2xl">
              Let&apos;s complete onboarding for {restaurantName}
            </h1>
          </div>
        </div>
        <Badge variant="secondary">
          {restaurantStatus.replaceAll("_", " ")}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Required setup progress</span>
          <span className="text-muted-foreground">
            {completed} of {total} complete
          </span>
        </div>
        <Progress value={(completed / total) * 100} />
      </div>

      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {restaurantSetupSections
          .filter((section) => section.required)
          .map((section) => {
            const status = setup[section.slug]
            const isComplete = status === "COMPLETED"
            const isCurrent = section.slug === current

            return (
              <li
                key={section.slug}
                className="flex items-center gap-2 rounded-xl border border-transparent bg-muted/35 px-3 py-2.5 text-sm"
              >
                {isComplete ? (
                  <CheckIcon className="size-4 text-primary" />
                ) : isCurrent ? (
                  <CircleIcon className="size-4 fill-primary text-primary" />
                ) : (
                  <LockKeyholeIcon className="size-4 text-muted-foreground" />
                )}
                <span className={isCurrent ? "font-medium" : undefined}>
                  {section.label}
                </span>
              </li>
            )
          })}
      </ol>
    </header>
  )
}
