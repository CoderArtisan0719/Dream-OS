import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { profiles } from "./models/profiles";
import { users } from "./models/users";
import { tokens } from "./models/tokens";

const app = new Elysia({ prefix: "/api/v1" })
  .use(
    cors({
      origin: (origin) => {
        const allowedOrigins =
          process.env.NODE_ENV === "production"
            ? ["https://desktop-t.vercel.app"]
            : ["http://localhost:3000", "http://localhost:6006"];

        const originUrl = origin.headers.get("origin");
        const requestedFrom = origin.headers.get("X-Requested-From");

        return (
          allowedOrigins.includes(originUrl ?? "") ||
          originUrl?.endsWith(".breadheadnfts.vercel.app") ||
          originUrl?.startsWith("https://desktop-t-git-") ||
          requestedFrom === "iOS-App"
        );
      },
      credentials: true,
    }),
  )
  .use(
    swagger({
      exclude: ["/api/v1/swagger", "/api/v1/swagger/json"],
    }),
  )
  .use(profiles)
  .use(users)
  .use(tokens);

export const GET = app.handle;
export const POST = app.handle;
export const PUT = app.handle;
export const PATCH = app.handle;
export const DELETE = app.handle;
export const OPTIONS = app.handle;
export const HEAD = app.handle;

export type App = typeof app;
