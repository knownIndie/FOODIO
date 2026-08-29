import "server-only"
import { sendMailtrapVerificationEmail } from "./mailtrap"
import type { SendVerificationEmailInput } from "./verification-message"

export async function sendVerificationEmail(input: SendVerificationEmailInput) {
  return sendMailtrapVerificationEmail(input)
}
