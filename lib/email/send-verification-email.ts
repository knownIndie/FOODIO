import "server-only"
import { getServiceMode } from "@/lib/config/service-mode"
import { sendMailpitVerificationEmail } from "./mailpit"
import { sendMailtrapVerificationEmail } from "./mailtrap"
import type { SendVerificationEmailInput } from "./verification-message"

export async function sendVerificationEmail(input: SendVerificationEmailInput) {
  if (getServiceMode() === "local") {
    return sendMailpitVerificationEmail(input)
  }

  return sendMailtrapVerificationEmail(input)
}
