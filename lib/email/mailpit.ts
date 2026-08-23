import nodemailer from "nodemailer"
import {
  createVerificationMessage,
  type SendVerificationEmailInput,
} from "./verification-message"

function mailpitTransport() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT)

  if (!host) throw new Error("SMTP_HOST_NOT_CONFIGURED")
  if (!Number.isSafeInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT_NOT_CONFIGURED")
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false,
  })
}

export async function sendMailpitVerificationEmail(
  input: SendVerificationEmailInput
) {
  const message = createVerificationMessage(input)

  await mailpitTransport().sendMail({
    from: { address: message.from.email, name: message.from.name },
    html: message.html,
    subject: message.subject,
    text: message.text,
    to: message.to.map((recipient) => recipient.email),
  })
}

export async function verifyMailpitConnection() {
  await mailpitTransport().verify()
}
