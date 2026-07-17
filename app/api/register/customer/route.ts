import { registerProfile } from "@/lib/auth/register-profile"
import { signupFormSchema } from "@/lib/auth/schema/form-schemas"

export async function POST(request: Request) {
  const parsed = signupFormSchema.safeParse(request) // needs fixing

  if (!parsed.success) {
    return Response.json(
      {
        error: "data entered is invalid",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 404 }
    )
  }

  try {
    const profileData = await registerProfile({
      ...parsed.data,
      roles: ["CUSTOMER"],
    })
    console.log(
      `profile created succesfully for the user ${profileData.username} with email:${profileData.email}`
    )
    return Response.json({ profileData }, { status: 201 })
  } catch (error) {
    return Response.json(
      {
        error: "some error occured while registering your profile",
        profileError: error,
      },
      { status: 404 }
    )
  }
}
