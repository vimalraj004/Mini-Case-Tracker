import { Router } from "express";

import {
  getDashboardOverview,
} from "../controllers/dashBoardController.js";

import {
  requireAuth,
} from "../middleware/auth.js";

const router = Router();

router.get(
  "/overview",
  requireAuth,
  getDashboardOverview
);

export default router;