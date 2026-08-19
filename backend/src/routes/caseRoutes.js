import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  listCases, getCase, createCase, updateCase, addComment, changeStatus
} from "../controllers/caseController.js";
import { createCaseSchema, updateCaseSchema, commentSchema, statusSchema } from "../validators/caseSchemas.js";
import { upload } from "../middleware/upload.js";
import { uploadDocument } from "../controllers/documentController.js";

const router = Router();

router.use(requireAuth);
router.get("/", listCases);
router.get("/:id", getCase);
router.post("/", requireRole("MANAGER"), validate(createCaseSchema), createCase);
router.patch("/:id", validate(updateCaseSchema), updateCase);
router.post("/:id/comments", validate(commentSchema), addComment);
router.patch("/:id/status", validate(statusSchema), changeStatus);
router.post("/:id/documents", upload.single("file"), uploadDocument);

export default router;
