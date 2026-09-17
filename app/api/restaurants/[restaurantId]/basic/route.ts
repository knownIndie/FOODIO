export async function PATCH() {
  return Response.json(
    {
      error: "Onboarding now uses one form. Reload the setup page to continue.",
    },
    { status: 410 }
  )
}
