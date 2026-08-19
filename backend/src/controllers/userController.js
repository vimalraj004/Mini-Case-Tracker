import bcrypt from "bcryptjs";

import { User } from "../models/User.js";
import { Case } from "../models/Case.js";

/**
 * Get agents
 *
 * GET /api/users/agents
 * GET /api/users/agents?search=john
 */
export async function getAgents(req, res, next) {
  try {
    const { search = "" } = req.query;

    const userFilter = {
      role: "AGENT",
    };

    // Search by name or email
    if (search.trim()) {
      userFilter.$or = [
        {
          name: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          email: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    // Get agents
    const agents = await User.find(userFilter)
      .select("_id name email role isActive createdAt")
      .sort({ name: 1 })
      .lean();

    // Get agent IDs
    const agentIds = agents.map((agent) => agent._id);

    // Count assigned cases
    const caseCounts = await Case.aggregate([
      {
        $match: {
          agent: {
            $in: agentIds,
          },
        },
      },
      {
        $group: {
          _id: "$agent",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // Convert counts into Map
    const countMap = new Map(
      caseCounts.map((item) => [
        item._id.toString(),
        item.count,
      ])
    );

    // Add assignedCasesCount
    const result = agents.map((agent) => ({
      ...agent,

      assignedCasesCount:
        countMap.get(agent._id.toString()) || 0,
    }));

    return res.status(200).json({
      agents: result,
    });
  } catch (err) {
    console.error("Get agents error:", err);

    next(err);
  }
}

/**
 * Create new agent
 *
 * POST /api/users/agents
 */
export async function createAgent(req, res, next) {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    // Basic validation
    if (!name?.trim()) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    // Create agent
    const agent = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "AGENT",
      isActive: true,
    });

    // Never send passwordHash to frontend
    return res.status(201).json({
      message: "Agent created successfully",
      agent: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        isActive: agent.isActive,
        createdAt: agent.createdAt,
        assignedCasesCount: 0,
      },
    });
  } catch (err) {
    console.error("Create agent error:", err);

    // Mongo duplicate key safety
    if (err.code === 11000) {
      return res.status(409).json({
        message: "A user with this email already exists",
      });
    }

    next(err);
  }
}


/**
 * Get currently logged-in user's profile
 *
 * GET /api/users/profile
 */
export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .select("_id name email role isActive createdAt updatedAt")
      .lean();

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (err) {
    next(err);
  }
}