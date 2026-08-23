import "server-only"
import { MailtrapClient } from "mailtrap"
import {
  createVerificationMessage,
  type SendVerificationEmailInput,
} from "./verification-message"

function mailtrapClient() {
  const token = process.env.MAILTRAP_API_TOKEN
  const testInboxId = Number(process.env.MAILTRAP_TEST_INBOX_ID)

  if (!token) {
    throw new Error("MAILTRAP_API_TOKEN_NOT_CONFIGURED")
  }

  if (!Number.isSafeInteger(testInboxId) || testInboxId <= 0) {
    throw new Error("MAILTRAP_TEST_INBOX_ID_NOT_CONFIGURED")
  }

  return new MailtrapClient({
    token,
    sandbox: true,
    testInboxId,
  })
}

export async function sendMailtrapVerificationEmail({
  email,
  code,
}: SendVerificationEmailInput) {
  const message = createVerificationMessage({ email, code })

  await mailtrapClient().send({
    ...message,
  })
}
