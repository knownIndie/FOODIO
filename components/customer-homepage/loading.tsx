import { Skeleton } from "@/components/ui/skeleton"

const placeholderKeys = ["first", "second", "third", "fourth", "fifth", "sixth"]

export default function CustomerPageLoading() {
  return (
    <div className="space-y-8">
      <section className="max-w-3xl space-y-3">
        <Skeleton className="h-12 w-80 max-w-full" />
        <Skeleton className="h-6 w-lg max-w-full" />
      </section>

      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-9 w-48 rounded-full" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {placeholderKeys.map((key) => (
          <div
            key={key}
            className="space-y-4 rounded-3xl border border-border bg-card p-3 shadow-sm"
          >
            <Skeleton className="h-40 w-full" />
            <div className="space-y-2 px-1 pb-1">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
