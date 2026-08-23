export type SendVerificationEmailInput = {
  email: string
  code: string
}

export function createVerificationMessage({
  email,
  code,
}: SendVerificationEmailInput) {
  const fromEmail =
    process.env.MAILTRAP_FROM_EMAIL?.trim() || "no-reply@foodio.test"

  return {
    category: "email-verification",
    from: { name: "FoodIO", email: fromEmail },
    html: [
      '<div style="font-family:Arial,sans-serif;line-height:1.5;color:#171717">',
      "<h1>Verify your FoodIO email</h1>",
      "<p>Use this six-digit code to verify your account:</p>",
      `<p style="font-size:32px;font-weight:700;letter-spacing:8px">${code}</p>`,
      "<p>This code expires in 10 minutes.</p>",
      "<p>If you did not create this account, ignore this message.</p>",
      "</div>",
    ].join(""),
    subject: `${code} is your FoodIO verification code`,
    text: [
      `Your FoodIO verification code is ${code}.`,
      "",
      "It expires in 10 minutes.",
      "If you did not create this account, ignore this message.",
    ].join("\n"),
    to: [{ email }],
  }
}
