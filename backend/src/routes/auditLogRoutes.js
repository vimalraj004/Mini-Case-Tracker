import express from "express";
import { getAuditLogs } from "../controllers/auditLogController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/",requireAuth, requireRole("MANAGER"), getAuditLogs);

export default router;