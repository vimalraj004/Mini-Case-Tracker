import { Router } from "express";
import { login, me,resetPassword } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginSchema,resetPasswordSchema } from "../validators/authSchemas.js";

const router = Router();
router.post("/login", validate(loginSchema), login);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.get("/me", requireAuth, me);
export default router;
