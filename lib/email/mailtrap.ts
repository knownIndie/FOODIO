import "server-only"
import { MailtrapClient } from "mailtrap"

type SendVerificationEmailInput = {
  email: string
  code: string
}

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

export async function sendVerificationEmail({
  email,
  code,
}: SendVerificationEmailInput) {
  const fromEmail =
    process.env.MAILTRAP_FROM_EMAIL?.trim() || "no-reply@foodio.test"

  await mailtrapClient().send({
    from: { name: "FoodIO", email: fromEmail },
    to: [{ email }],
    subject: `${code} is your FoodIO verification code`,
    category: "email-verification",
    text: [
      `Your FoodIO verification code is ${code}.`,
      "",
      "It expires in 10 minutes.",
      "If you did not create this account, ignore this message.",
    ].join("\n"),
    html: [
      '<div style="font-family:Arial,sans-serif;line-height:1.5;color:#171717">',
      "<h1>Verify your FoodIO email</h1>",
      "<p>Use this six-digit code to verify your account:</p>",
      `<p style="font-size:32px;font-weight:700;letter-spacing:8px">${code}</p>`,
      "<p>This code expires in 10 minutes.</p>",
      "<p>If you did not create this account, ignore this message.</p>",
      "</div>",
    ].join(""),
  })
}
