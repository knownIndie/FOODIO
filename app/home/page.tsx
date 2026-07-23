import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <div className="max-w-md space-y-2 text-center">
        <h1 className="font-heading text-3xl font-semibold">FoodIO</h1>
        <p className="text-muted-foreground">
          Your home dashboard is ready for its first feature.
        </p>
        <Link href="/login">
          <Button variant="link" size="lg">
            {" "}
            login{" "}
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="link" size="lg">
            {" "}
            Sign Up{" "}
          </Button>
        </Link>
      </div>
    </main>
  )
}
