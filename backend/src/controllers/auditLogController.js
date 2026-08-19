import { AuditLog } from "../models/AuditLog.js";

export async function getAuditLogs(req, res, next) {
  try {
    const {
      search = "",
      action = "",
      page = 1,
      limit = 20,
    } = req.query;

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const filter = {};

    // Filter by action
    if (action.trim()) {
      filter.action = action.trim();
    }

    // Search case ID
    if (search.trim()) {
      filter.$or = [
        {
          caseId: {
            $regex: search.trim(),
            $options: "i",
          },
        },
        {
          details: {
            $regex: search.trim(),
            $options: "i",
          },
        },
      ];
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .populate("performedBy", "name email role")
        .populate("case", "caseId clientName subjectName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      AuditLog.countDocuments(filter),
    ]);

    return res.status(200).json({
      logs,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error("Get audit logs error:", error);
    next(error);
  }
}