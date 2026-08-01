import { currentProfile } from "@/lib/auth/current-profile";
import { addProfileRole, registerProfile } from "@/lib/auth/register-profile";
import { signupFormSchema } from "@/lib/auth/schema/form-schemas";
import { treeifyError } from "zod";

export async function POST(request: Request) {
  try {
    const profile = await currentProfile();
    if (profile) {
      await addProfileRole(profile.id, "DELIVERY_PARTNER");
      return Response.json(
        { message: "delivery partner profile registered successfully." },
        { status: 200 },
      );
    } else {
      try {
        const parsed = signupFormSchema.safeParse(
          await request.json().catch(() => null), // it tries to parse the request body as json, if it fails then it catches the error and returns null instead
        );
        if (!parsed.success) {
          return Response.json(
            {
              error: "data entered is invalid",
              fields: treeifyError(parsed.error).errors,
            },
            { status: 400 },
          );
        }
        const result = await registerProfile({
          ...parsed.data,
          roles: ["DELIVERY_PARTNER"],
        });
        if (result) {
          return Response.json(
            { message: "delivery partner profile registered successfully." },
            { status: 201 },
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === "EMAIL_ALREADY_EXISTS") {
            return Response.json(
              {
                code: "ACCOUNT_ALREADY_EXISTS",
                error:
                  "A FoodIO account already exists with this email. Log in to continue joining as a delivery partner.",
                next: "/login",
              },
              { status: 409 },
            );
          }
          if (error.message === "USERNAME_ALREADY_EXISTS") {
            return Response.json(
              {
                code: "USERNAME_ALREADY_EXISTS",
                error:
                  "That username is already taken. Choose another username.",
              },
              { status: 409 },
            );
          }
        }

        console.error(`[ ${error} ] \n : from register/delivery route`);
      }
    }
  } catch (error) {
    console.error(`[ ${error} ] \n : from register/delivery route`);
    return Response.json(
      { error: "Unable to register your profile." },
      { status: 500 },
    );
  }
}
