import { Case } from "../models/Case.js";
import { User } from "../models/User.js";
import { Comment } from "../models/Comment.js";
import { AuditLog } from "../models/AuditLog.js";
import { Document } from "../models/Document.js";
import { ApiError } from "../utils/apiError.js";
import { transitionCase } from "../services/caseService.js";
import { createAuditLog } from "../utils/CreateAuditLogs.js";

export async function listCases(req, res, next) {
  try {
    const {
      search = "",
      status,
      agent,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};
    if (req.user.role === "AGENT") filter.agent = req.user._id;
    if (status) filter.status = status;
    if (agent && req.user.role === "MANAGER") filter.agent = agent;

    if (search) {
      filter.$or = [
        { caseId: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
        { subjectName: { $regex: search, $options: "i" } }
      ];
    }

    const safeLimit = Math.min(Number(limit), 50);
    const safePage = Math.max(Number(page), 1);

    const [items, total] = await Promise.all([
      Case.find(filter)
        .populate("agent", "name email")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      Case.countDocuments(filter)
    ]);

    res.json({
      items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        pages: Math.ceil(total / safeLimit)
      }
    });
  } catch (err) { next(err); }
}

export async function getCase(req, res, next) {
  try {
    const doc = await Case.findById(req.params.id)
      .populate("agent", "name email")
      .populate("createdBy", "name email");

    if (!doc) throw new ApiError(404, "Case not found");
    if (req.user.role === "AGENT" && String(doc.agent?._id) !== String(req.user._id)) {
      throw new ApiError(403, "Access denied");
    }

    const [comments, documents, auditLogs] = await Promise.all([
      Comment.find({ case: doc._id }).populate("author", "name role").sort({ createdAt: -1 }),
      Document.find({ case: doc._id }).populate("uploadedBy", "name role").sort({ createdAt: -1 }),
      AuditLog.find({ case: doc._id }).populate("performedBy", "name email role").sort({ createdAt: 1 })
    ]);

    res.json({ case: doc, comments, documents, auditLogs });
  } catch (err) { next(err); }
}

export async function createCase(req, res, next) {
  try {
    const { clientName, subjectName, caseType, dueDate, description, agentId } = req.body;

    if (agentId) {
      const agent = await User.findOne({ _id: agentId, role: "AGENT", isActive: true });
      if (!agent) throw new ApiError(400, "Invalid agent");
    }

    const doc = await Case.create({
      clientName,
      subjectName,
      caseType,
      dueDate,
      description,
      agent: agentId || null,
      createdBy: req.user._id,
      status: agentId ? "Assigned" : "New"
    });

    await createAuditLog({
  action: "CASE_CREATED",
  caseData: doc,
  performedBy: req.user._id,
  details: `Created case ${doc.caseId}`,
});

    const populated = await Case.findById(doc._id)
      .populate("agent", "name email")
      .populate("createdBy", "name email");

    res.status(201).json({ case: populated });
  } catch (err) { next(err); }
}

export async function updateCase(req, res, next) {
  try {
    const doc = await Case.findById(req.params.id);
    if (!doc) throw new ApiError(404, "Case not found");

    const { clientName, subjectName, caseType, dueDate, description, agentId, status } = req.body;

    if (req.user.role === "AGENT") {
      if (String(doc.agent) !== String(req.user._id)) throw new ApiError(403, "Access denied");
      if (["clientName", "subjectName", "caseType", "dueDate", "agentId"].some(k => req.body[k] !== undefined)) {
        throw new ApiError(403, "Agents cannot modify case assignment details");
      }
    }

    if (clientName !== undefined) doc.clientName = clientName;
    if (subjectName !== undefined) doc.subjectName = subjectName;
    if (caseType !== undefined) doc.caseType = caseType;
    if (dueDate !== undefined) doc.dueDate = dueDate;
    if (description !== undefined) doc.description = description;

    if (req.user.role === "MANAGER" && agentId !== undefined) {
      if (agentId) {
        const agent = await User.findOne({ _id: agentId, role: "AGENT", isActive: true });
        if (!agent) throw new ApiError(400, "Invalid agent");
        doc.agent = agentId;
        if (doc.status === "New") {
          await transitionCase({ caseDoc: doc, toStatus: "Assigned", actor: req.user });
        }
      } else {
        doc.agent = null;
      }
    }

    await doc.save();

    if (status && status !== doc.status) {
      await transitionCase({ caseDoc: doc, toStatus: status, actor: req.user });
    }

    res.json({ case: await Case.findById(doc._id).populate("agent", "name email") });
  } catch (err) { next(err); }
}

export async function addComment(req, res, next) {
  try {
    const doc = await Case.findById(req.params.id);
    if (!doc) throw new ApiError(404, "Case not found");
    if (req.user.role === "AGENT" && String(doc.agent) !== String(req.user._id)) {
      throw new ApiError(403, "Access denied");
    }

    const comment = await Comment.create({
      case: doc._id,
      author: req.user._id,
      text: req.body.text
    });

    res.status(201).json({ comment: await comment.populate("author", "name role") });
  } catch (err) { next(err); }
}

export async function changeStatus(req, res, next) {
  try {
    const doc = await Case.findById(req.params.id);
    if (!doc) throw new ApiError(404, "Case not found");

    if (req.user.role === "AGENT" && String(doc.agent) !== String(req.user._id)) {
      throw new ApiError(403, "Access denied");
    }

    const updated = await transitionCase({
      caseDoc: doc,
      toStatus: req.body.status,
      actor: req.user
    });

    res.json({ case: updated });
  } catch (err) { next(err); }
}
