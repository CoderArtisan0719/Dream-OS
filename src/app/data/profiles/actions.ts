"use server";

import {
  ValidationStatus,
  validationInitialState,
} from "@/app/api/v1/constants";
import { getCookieHeader } from "@/app/data/utils";
import { getApi } from "@/utils/getApi";
import { redirect } from "next/navigation";

export async function validateDreamId(
  prevState: any,
  formData: FormData,
): Promise<{
  error?: string | null;
  status: ValidationStatus;
  dreamId: string;
}> {
  console.log("inside validateDreamId server action");
  const dreamId = formData.get("dreamId") as string;

  console.log({ dreamId });

  if (!dreamId || !dreamId.length) {
    return validationInitialState;
  }

  const { api } = getApi();

  const res = await api.v1.profiles.validate.get({
    headers: await getCookieHeader(),
    query: { dreamId },
  });

  console.log({ res });

  if (res.data?.valid) {
    return {
      status: "available",
      dreamId,
    };
  } else {
    return {
      error: res.error?.value.message,
      status: "unavailable",
      dreamId,
    };
  }
}

export async function createDreamId(
  prevState: any,
  formData: FormData,
): Promise<{
  error?: string | null;
}> {
  const dreamId = formData.get("dreamId") as string;

  if (!dreamId || !dreamId.length) {
    return {
      error: "Dream ID is required",
    };
  }

  const { api } = getApi();

  console.log("server action attempting to set dreamId", dreamId);

  const res = await api.v1.profiles.index.patch(
    { dreamId },
    { headers: await getCookieHeader() },
  );

  if (res.error) {
    return {
      error: res.error.value.message,
    };
  }

  redirect("/desktop");
}
