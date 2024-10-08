import { getApi } from "@/utils/getApi";
import { getCookieHeader } from "../utils";

export async function getUser() {
  console.log("getting user server action");

  const { api } = getApi();

  const users = await api.v1.users.index.get({
    headers: await getCookieHeader(),
  });

  // console.log({ users });

  if (users.error) {
    console.dir(users.error, { depth: null });
    // console.error(users.error.value.message);
    return {
      dreamId: "???",
      error: users.error.value.message,
    };
  }
  return { dreamId: users.data.dreamId };
}
