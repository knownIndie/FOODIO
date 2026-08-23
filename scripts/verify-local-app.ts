import assert from "node:assert/strict"

const applicationUrl = process.env.FOODIO_APP_URL || "http://127.0.0.1:3000"
const mailpitUrl = process.env.MAILPIT_URL || "http://127.0.0.1:8025"
const uniqueValue = `${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`
const username = `docker_${Date.now().toString(36)}_${Math.floor(
  Math.random() * 1_000_000
).toString(36)}`
const email = `docker-flow-${uniqueValue}@foodio.test`
const password = "FoodioLocal123!"

const registrationResponse = await fetch(`${applicationUrl}/api/register`, {
  body: JSON.stringify({
    email,
    name: "Docker Flow",
    password,
    username,
  }),
  headers: { "content-type": "application/json" },
  method: "POST",
})
const registrationBody = await registrationResponse.json()

assert.equal(
  registrationResponse.status,
  201,
  `Registration failed: ${JSON.stringify(registrationBody)}`
)
assert.deepEqual(
  {
    emailSent: registrationBody.emailSent,
    next: registrationBody.next,
    success: registrationBody.success,
    verificationRequired: registrationBody.verificationRequired,
  },
  {
    emailSent: true,
    next: "/verify-email",
    success: true,
    verificationRequired: true,
  }
)

const setCookie = registrationResponse.headers.get("set-cookie")
assert.ok(setCookie, "Registration did not set the access-token cookie")
const accessTokenCookie = setCookie.split(";", 1)[0]

type MailpitMessage = {
  Subject: string
  To: Array<{ Address: string }>
}

type MailpitMessagesResponse = {
  messages: MailpitMessage[]
}

let verificationSubject: string | undefined
for (let attempt = 0; attempt < 20; attempt += 1) {
  const mailpitResponse = await fetch(`${mailpitUrl}/api/v1/messages`)
  assert.equal(mailpitResponse.ok, true)
  const mailpitBody = (await mailpitResponse.json()) as MailpitMessagesResponse
  verificationSubject = mailpitBody.messages.find((message) =>
    message.To.some((recipient) => recipient.Address === email)
  )?.Subject

  if (verificationSubject) break
  await new Promise((resolve) => setTimeout(resolve, 100))
}

assert.ok(verificationSubject, "Mailpit did not receive the verification email")
const verificationCode = verificationSubject.match(/^\d{6}/)?.[0]
assert.ok(verificationCode, "Verification email subject did not contain an OTP")

const verificationResponse = await fetch(
  `${applicationUrl}/api/auth/email-verification/verify`,
  {
    body: JSON.stringify({ code: verificationCode }),
    headers: {
      "content-type": "application/json",
      cookie: accessTokenCookie,
    },
    method: "POST",
  }
)
assert.equal(verificationResponse.status, 200)
assert.deepEqual(await verificationResponse.json(), {
  success: true,
  verified: true,
})

const loginStatuses = []
for (let attempt = 0; attempt < 6; attempt += 1) {
  const loginResponse = await fetch(`${applicationUrl}/api/login/customer`, {
    body: JSON.stringify({ email, password }),
    headers: { "content-type": "application/json" },
    method: "POST",
  })
  loginStatuses.push(loginResponse.status)

  if (attempt === 5) {
    assert.equal(loginResponse.headers.get("retry-after") !== null, true)
    const loginBody = await loginResponse.json()
    assert.equal(loginBody.code, "LOGIN_RATE_LIMITED")
  }
}

assert.deepEqual(loginStatuses, [200, 200, 200, 200, 200, 429])

console.log(
  "Local application verification passed: registration, Mailpit OTP delivery, OTP verification, login, and rate limiting work."
)
