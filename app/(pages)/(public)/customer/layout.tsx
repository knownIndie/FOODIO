import { CustomerShell } from "@/components/customer-homepage/customer-shell"
import { CustomerHeader } from "@/components/customer-homepage/site-header"
import { Footer } from "@/components/footer/footer"

import { currentProfile } from "@/lib/auth/current-profile"

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await currentProfile()
  return (
    <CustomerShell
      header={<CustomerHeader profile={profile} />}
      footer={<Footer />}
    >
      {children}
    </CustomerShell>
  )
}
