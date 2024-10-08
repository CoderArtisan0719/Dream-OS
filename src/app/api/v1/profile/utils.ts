import { z } from "zod";

export const nameSchema = z
  .string()
  .min(1, "Name must not be empty")
  .max(24, "Name must be 24 characters or less")
  .regex(
    /^[\p{L}\p{N}\p{Emoji}\p{Emoji_Component}_\-']+$/u,
    "Name contains invalid characters",
  )
  .transform((name) => name.trim());

export function validateName(name: string) {
  const nameResult = nameSchema.safeParse(name);

  if (!nameResult.success) {
    const error = nameResult.error.issues[0].message;
    console.error({ error });
    return { valid: false, error };
  }

  return { name: nameResult.data, valid: true };
}
