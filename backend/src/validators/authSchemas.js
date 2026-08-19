import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(15)
});
export const resetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(8),
});