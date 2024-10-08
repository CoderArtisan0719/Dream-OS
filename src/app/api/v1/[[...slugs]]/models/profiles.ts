import { Elysia, t } from "elysia";

import { errorMessageResponseType } from "@/app/data/utils";
import { authGuardPlugin } from "@/app/api/v1/plugins";
import { validateName } from "@/app/api/v1/profile/utils";

export const profiles = new Elysia({
  prefix: "/profiles",
  tags: ["auth"],
})
  .use(authGuardPlugin)
  .patch(
    "/",
    async ({ body, user, db, error }) => {
      console.log("inside PATCH /api/user/profile");

      console.log({ dreamId: body.dreamId });

      const validationResult = validateName(body.dreamId);

      if (!validationResult.valid) {
        return error(400, {
          message: validationResult.error || "Invalid Dream ID",
        });
      }

      try {
        const profileRes = await db
          .from("profiles")
          .update({ dream_id: validationResult.name })
          .eq("id", user.id)
          .select("dream_id");

        if (!profileRes.data || !profileRes.data[0] || profileRes.error) {
          console.error({ data: profileRes.data, error: profileRes.error });
          return error(400, { message: "Unable to update Dream ID." });
        }

        // console.log({ data: profileRes.data, error: profileRes.error });

        return { message: "Profile updated successfully." };
      } catch (err: any) {
        console.error("Error updating profile:", err);
        return error(500, { message: "Error updating profile" });
      }
    },
    {
      body: t.Object({
        dreamId: t.String(),
      }),
      response: {
        200: t.Object({ message: t.String() }),
        400: errorMessageResponseType,
        401: errorMessageResponseType,
        500: errorMessageResponseType,
      },
    },
  )
  .get(
    "/validate",
    async ({ query, error, db }) => {
      console.log("inside GET validate");

      const dreamId = query.dreamId;

      const validationResult = validateName(dreamId);

      if (!validationResult.valid) {
        return {
          valid: false,
          error: validationResult.error,
        };
      }

      if (!validationResult.name) {
        return { valid: false, error: "Dream ID is required" };
      }

      const profileRes = await db
        .from("profiles")
        .select("dream_id")
        .ilike("dream_id", validationResult.name)
        .maybeSingle();

      if (profileRes.data) {
        return { valid: false, error: "Dream ID already taken" };
      }

      if (profileRes.error) {
        return error(500, { message: "Database error" });
      }

      return { valid: true };
    },
    {
      query: t.Object({ dreamId: t.String() }),
      response: {
        200: t.Object({
          valid: t.Boolean(),
          error: t.Optional(t.String()),
        }),
        400: errorMessageResponseType,
        500: errorMessageResponseType,
      },
    },
  );
