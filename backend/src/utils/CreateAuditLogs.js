import { AuditLog } from "../models/AuditLog.js";

export async function createAuditLog({
  action,
  caseData = null,
  performedBy,
  details,
  metadata = {},
}) {
  return AuditLog.create({
    action,

    case: caseData?._id || null,

    caseId: caseData?.caseId || null,

    performedBy,

    details,

    metadata,
  });
}