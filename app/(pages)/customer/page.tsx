import { SiteHeader } from "@/components/home/site-header"
import { currentProfile } from "@/lib/auth/current-profile"

const profile = await currentProfile()

export default function CustomerPage() {
  return (
    <div className="mx-auto min-h-svh bg-background">
      {" "}
      <SiteHeader profile={profile} />
      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        hello from the customer side
      </section>
    </div>
  )
}
