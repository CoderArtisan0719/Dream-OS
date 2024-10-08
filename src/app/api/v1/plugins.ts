import { Elysia, t } from "elysia";

import { createSupabaseClient } from "@/utils/supabase/server";
import { DREAM_ACCESS_TOKEN_COOKIE } from "./constants";

export const authGuardPlugin = new Elysia({ normalize: true })
  .guard({
    cookie: t.Optional(
      t.Cookie(
        {
          [DREAM_ACCESS_TOKEN_COOKIE]: t.String(),
        },
        {
          secure: true,
          httpOnly: true,
        },
      ),
    ),
    // this is buggy, it causes typescript errors
    // headers: t.Optional(
    //   t.Object({
    //     authorization: t.Optional(t.String()),
    //     Cookie: t.Optional(t.String()),
    //   }),
    // ),
  })
  .resolve(async ({ cookie, headers, error }) => {
    console.log("WE ARE IN THE RESOLVE PLUGIN");
    let accessToken = undefined;

    if (cookie[DREAM_ACCESS_TOKEN_COOKIE].value) {
      accessToken = cookie[DREAM_ACCESS_TOKEN_COOKIE].value;
    } else if (headers.authorization) {
      const [bearer, token] = headers.authorization.split(" ");
      if (bearer.toLowerCase() === "bearer" && token) {
        accessToken = token;
      }
    }

    console.log({ accessToken });
    console.log("I am inside the plugin");

    if (!accessToken) {
      return error(401, { message: "No authentication provided" });
    }

    const supabase = createSupabaseClient(accessToken);

    const getUserRes = await supabase.auth.getUser(accessToken);

    const user = getUserRes.data?.user;

    if (getUserRes.error || !user) {
      console.error({
        user: getUserRes.data.user,
        error: getUserRes.error,
      });
      return error(401, { message: "AuthApiError" });
    }

    return {
      user: getUserRes.data.user,
      db: supabase,
    };
  })
  .as("plugin");
