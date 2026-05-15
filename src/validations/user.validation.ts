// src/validations/user.validation.ts

import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Minimal 2 karakter")
    .max(100, "Maksimal 100 karakter")
    .optional(),
  image: z.string().url("URL tidak valid").optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
