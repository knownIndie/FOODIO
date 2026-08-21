import { SignupForm } from "@/components/auth/signup-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { customerTestDetails } from "@/lib/auth/test-details"
// default customer signup page
export default function SignupPage() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Join FoodIO as a customer.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm
            endpoint="/api/register"
            loginHref="/login/customer"
            returnTo="/"
            testDetails={customerTestDetails}
          />
        </CardContent>
      </Card>
    </main>
  )
}
