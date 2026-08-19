import { Router } from "express";

import {
  requireAuth,
  requireRole,
} from "../middleware/auth.js";

import {
  getAgents,
  createAgent,
  getProfile,
} from "../controllers/userController.js";

const router = Router();

// Get all agents
router.get(
  "/agents",
  requireAuth,
  requireRole("MANAGER"),
  getAgents
);

// Create agent
router.post(
  "/agents",
  requireAuth,
  requireRole("MANAGER"),
  createAgent
);



// Get logged-in user's profile
router.get(
  "/profile",
  requireAuth,
  getProfile
);

export default router;