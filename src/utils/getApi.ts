import type { App } from "@/app/api/v1/[[...slugs]]/route";
import { getApiBaseUrl } from "@/app/api/v1/utils";
import { treaty } from "@elysiajs/eden";

const app = treaty<App>(getApiBaseUrl());

export function getApi() {
  return { api: app.api };
}
