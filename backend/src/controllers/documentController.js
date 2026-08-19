import fs from "fs/promises";
import { Document } from "../models/Document.js";
import { Case } from "../models/Case.js";
import { ApiError } from "../utils/apiError.js";

export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) throw new ApiError(400, "A file is required");

    const doc = await Case.findById(req.params.id);
    if (!doc) throw new ApiError(404, "Case not found");
    if (req.user.role === "AGENT" && String(doc.agent) !== String(req.user._id)) {
      throw new ApiError(403, "Access denied");
    }

    const saved = await Document.create({
      case: doc._id,
      uploadedBy: req.user._id,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    res.status(201).json({ document: saved });
  } catch (err) {
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
    next(err);
  }
}
