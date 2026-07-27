import { currentProfile } from "@/lib/auth/current-profile"
import { addProfileRole, registerProfile } from "@/lib/auth/register-profile"
import { signupFormSchema } from "@/lib/auth/schema/form-schemas"

export async function POST(request: Request) {
  try {
    const profile = await currentProfile()
    if (profile) {
      await addProfileRole(profile.id, "RESTAURANT_OWNER")
      return Response.json(
        { message: "restaurant profile registered successfully." },
        { status: 200 }
      )
    } else {
      const parsed = signupFormSchema.safeParse(
        await request.json().catch(() => null) // it tries to parse the request body as json, if it fails then it catches the error and returns null instead
      )

      if (!parsed.success) {
        return Response.json(
          {
            error: "data entered is invalid",
            fields: parsed.error.flatten().fieldErrors,
          },
          { status: 400 }
        )
      }

      await registerProfile({
        ...parsed.data,
        roles: ["RESTAURANT_OWNER"],
      })
      return Response.json(
        { message: "restaurant profile registered successfully." },
        { status: 201 }
      )
    }
  } catch (error) {
    console.error(`[ ${error} ] \n : from register/restaurant route`)
    return Response.json(
      { error: "Unable to register your profile." },
      { status: 500 }
    )
  }
}
