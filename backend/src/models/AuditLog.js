import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: [
        "CASE_CREATED",
        "CASE_ASSIGNED",
        "STATUS_CHANGED",
        "CASE_SUBMITTED",
        "CASE_CLEARED",
        "CASE_DISCREPANT",
        "CASE_UPDATED",
      ],
      required: true,
      index: true,
    },

    case: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      default: null,
      index: true,
    },

    caseId: {
      type: String,
      default: null,
      index: true,
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    details: {
      type: String,
      required: true,
      trim: true,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);