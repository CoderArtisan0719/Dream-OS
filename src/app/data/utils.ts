import { t } from "elysia";
import { cookies } from "next/headers";

export async function getCookieHeader() {
  const cookieStore = await cookies();
  const cookieString = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return {
    Cookie: cookieString,
  };
}

export const errorMessageResponseType = t.Object({
  message: t.String(),
});
