import { Case } from "../models/Case.js";
import { AuditLog } from "../models/AuditLog.js";
import { ApiError } from "../utils/apiError.js";
import { createAuditLog } from "../utils/CreateAuditLogs.js";

const transitions = {
  New: ["Assigned"],
  Assigned: ["In Progress"],
  "In Progress": ["Submitted"],
  Submitted: ["Cleared", "Discrepant"],
  Cleared: [],
  Discrepant: []
};

export async function transitionCase({ caseDoc, toStatus, actor }) {
  if (!transitions[caseDoc.status]?.includes(toStatus)) {
    throw new ApiError(400, `Invalid transition: ${caseDoc.status} -> ${toStatus}`);
  }

  const fromStatus = caseDoc.status;
  caseDoc.status = toStatus;
  await caseDoc.save();

 await createAuditLog({
  action: "STATUS_CHANGED",
 caseDoc: caseDoc,
  performedBy: actor,
  details: `Changed status from ${fromStatus} to ${toStatus}`,
  metadata: {
    oldStatus: fromStatus,
    newStatus: toStatus,
  },
});

  return caseDoc;
}
