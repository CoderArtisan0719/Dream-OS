import { Capsule, Environment } from "@usecapsule/server-sdk";
import { Elysia, t } from "elysia";
import jwt from "jsonwebtoken";

import { DREAM_ACCESS_TOKEN_COOKIE } from "@/app/api/v1/constants";
import { authGuardPlugin } from "@/app/api/v1/plugins";
import { errorMessageResponseType } from "@/app/data/utils";
import { supabaseAdmin } from "@/utils/supabase/server";
import { constructPhoneString } from "@/utils";

const CUSTOM_ERRORS = {
  CAPSULE_ID_MISMATCH: "E101",
  EMAIL_MISMATCH: "E102",
  PHONE_MISMATCH: "E103",
  EMAIL_DOESNT_MATCH_ID: "E104",
  PHONE_DOESNT_MATCH_ID: "E105",
  CREATE_USER_ERROR: "E106",
  INSERT_PROFILE_ERROR: "E107",
  MISSING_CONTACT_INFO: "E108",
  INVALID_SESSION: "E109",
};

const CAPSULE_ENVIRONMENT = Environment.DEVELOPMENT;

export const users = new Elysia({
  prefix: "/users",
  tags: ["auth"],
})
  .post(
    "/",
    async ({ body, set, error }) => {
      console.log("inside POST /api/user");

      const { capsuleId, email, phone, session } = body;

      console.log({ capsuleId, email, phone });
      // console.log({ session });

      // Check if both email and phone are missing
      if (!email && !phone) {
        return error(400, {
          message: "Either email or phone must be provided",
          code: CUSTOM_ERRORS.MISSING_CONTACT_INFO,
        });
      }

      try {
        await validateCapsuleSession({ session, capsuleId, email, phone });
      } catch (err: any) {
        console.error(err.cause, err.message);

        return error(400, {
          message: "Invalid Session",
          code: err.cause,
        });
      }

      const profileExistsRes = await supabaseAdmin
        .from("profiles")
        .select("id,dream_id")
        .eq("capsule_id", capsuleId)
        .maybeSingle();

      console.dir({ profileExistsRes }, { depth: null });

      if (profileExistsRes.data?.id) {
        const token = createJwt({
          id: profileExistsRes.data.id,
          capsuleId,
          email,
          phone,
        });

        set.headers = getSupabaseCookie(token);

        return {
          dreamId: profileExistsRes.data.dream_id,
          id: profileExistsRes.data.id,
          token,
        };
      } else if (profileExistsRes.data && !profileExistsRes.data.id) {
        console.error("AWKWARD...profile exists but has no id, creating user");
      }

      // let's create the user
      // make sure this email is not already associated with another capsule ID
      const emailExistsRes = await supabaseAdmin
        .from("profiles")
        .select("id,dream_id")
        .eq("email", email)
        .maybeSingle();

      console.dir({ emailExistsRes }, { depth: null });

      if (emailExistsRes.data) {
        return error(400, {
          message: "That email is associated with another capsule ID",
          code: CUSTOM_ERRORS.EMAIL_DOESNT_MATCH_ID,
        });
      }

      console.log({ phone });

      // make sure this phone number is not already associated with another capsule ID
      const phoneExistsRes = await supabaseAdmin
        .from("profiles")
        .select("id,dream_id")
        .eq("phone", phone)
        .maybeSingle();

      console.dir({ phoneExistsRes }, { depth: null });

      if (phoneExistsRes.data) {
        return error(400, {
          message: "That phone number is associated with another capsule ID",
          code: CUSTOM_ERRORS.PHONE_DOESNT_MATCH_ID,
        });
      }

      console.log("user definitely does not exist, create the user");

      let newUserId = "";

      try {
        // create user in auth.users table
        const uniqueEmail = email || `${Date.now()}@fakeemail.com`;

        const createRes = await supabaseAdmin.auth.admin.createUser({
          email: uniqueEmail,
          email_confirm: true,
          user_metadata: {
            capsule_id: capsuleId,
            phone,
          },
        });

        console.log({ createRes });

        newUserId = createRes.data?.user?.id || "";

        console.log({ newUserId });

        if (!newUserId || createRes.error) {
          console.error("Error creating user:", createRes.error);
          return error(400, {
            message: "Error creating user",
            code: CUSTOM_ERRORS.CREATE_USER_ERROR,
          });
        }

        // create user in public.profiles table
        const insertProfileRes = await supabaseAdmin.from("profiles").insert({
          id: newUserId,
          capsule_id: capsuleId,
          email,
          phone,
        });

        if (insertProfileRes.error) {
          console.error("Error inserting profile:", insertProfileRes.error);
          return error(400, {
            message: "Error inserting profile",
            code: CUSTOM_ERRORS.INSERT_PROFILE_ERROR,
          });
        }
      } catch (err: any) {
        console.error("Error creating user:", err);

        return error(400, {
          message: "Error creating user",
          code: CUSTOM_ERRORS.CREATE_USER_ERROR,
        });
      }

      const jwt = createJwt({
        id: newUserId,
        capsuleId,
        email,
        phone,
      });

      set.headers = getSupabaseCookie(jwt);

      return {
        dreamId: null,
        id: newUserId,
        token: jwt,
      };
    },
    {
      body: t.Object({
        capsuleId: t.String(),
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        session: t.String(),
      }),
      response: {
        200: t.Object({
          dreamId: t.Union([t.String(), t.Null()]),
          id: t.String(),
          token: t.String(),
        }),
        400: t.Object({
          message: t.String(),
          code: t.String(),
        }),
      },
      summary: "authenticate user",
      description:
        "Login to the app and retrieve an access token. Creates a new user if the user does not exist.",
    },
  )
  .use(authGuardPlugin)
  .get(
    "/",
    async ({ error, user, db }) => {
      const profileRes = await db
        .from("profiles")
        .select("dream_id,email,phone")
        .eq("id", user.id)
        .maybeSingle();
      // console.log({ profileRes });

      if (profileRes.error) {
        console.error(profileRes.error);
        return error(400, { message: "Unable to find that profile" });
      }
      if (!profileRes.data) {
        return error(404, { message: "Profile not found" });
      }

      return {
        dreamId: profileRes.data.dream_id,
        email: profileRes.data.email,
        phone: profileRes.data.phone,
      };
    },
    {
      response: {
        200: t.Object({
          dreamId: t.Union([t.String(), t.Null()]),
          email: t.Union([t.String(), t.Null()]),
          phone: t.Union([t.String(), t.Null()]),
        }),
        400: errorMessageResponseType,
        401: errorMessageResponseType,
        404: errorMessageResponseType,
      },
      description: "Get the user's profile information",
      security: ["cookie", "bearer"],
    },
  );

async function validateCapsuleSession({
  session,
  capsuleId,
  email,
  phone,
}: {
  session: string;
  capsuleId: string;
  email?: string;
  phone?: string;
}) {
  const capsuleClient = new Capsule(
    CAPSULE_ENVIRONMENT,
    process.env.NEXT_PUBLIC_CAPSULE_API_KEY,
  );

  await capsuleClient.importSession(session);

  // console.log({ capsuleClient });

  const theId = capsuleClient.getUserId();
  // console.log({ theId });

  if (theId !== capsuleId) {
    throw new Error("Capsule ID does not match", {
      cause: CUSTOM_ERRORS.CAPSULE_ID_MISMATCH,
    });
  }

  const theEmail = capsuleClient.getEmail();
  // console.log({ theEmail });

  if (theEmail && theEmail !== email) {
    throw new Error("Email address does not match", {
      cause: CUSTOM_ERRORS.EMAIL_MISMATCH,
    });
  }

  // todo: restore this check when Capsule fixes this by including phone and country code in the exported session token
  const phoneObj = capsuleClient.getPhone();
  console.log({ phoneObj, phone });

  if (phoneObj && constructPhoneString(phoneObj) !== phone) {
    throw new Error("Phone number does not match", {
      cause: CUSTOM_ERRORS.PHONE_MISMATCH,
    });
  }

  // const userExists = await capsuleClient.checkIfUserExists(email);
  // console.log({ userExists });
}

function getSupabaseCookie(token: string) {
  return {
    "Set-Cookie": `${DREAM_ACCESS_TOKEN_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=7200; Secure; SameSite=Strict`,
  };
}

function createJwt({
  id,
  capsuleId,
  email = "",
  phone = "",
}: {
  id: string;
  capsuleId: string;
  email?: string;
  phone?: string;
}) {
  return jwt.sign(
    {
      aud: "authenticated",
      sub: id,
      capsuleId,
      email,
      phone,
      role: "authenticated",
    },
    process.env.SUPABASE_JWT_SECRET || "",
    { expiresIn: "2h" },
  );
}
