import { z } from "zod";

const base = {
  clientName: z.string().trim().min(2).max(150),
  subjectName: z.string().trim().min(2).max(150),
  caseType: z.string().trim().min(2).max(100),
  dueDate: z.coerce.date(),
  description: z.string().trim().max(3000).optional().default(""),
  agentId: z.string().optional().nullable()
};

export const createCaseSchema = z.object(base);
export const updateCaseSchema = z.object({
  clientName: base.clientName.optional(),
  subjectName: base.subjectName.optional(),
  caseType: base.caseType.optional(),
  dueDate: base.dueDate.optional(),
  description: base.description.optional(),
  agentId: base.agentId,
  status: z.enum(["New", "Assigned", "In Progress", "Submitted", "Cleared", "Discrepant"]).optional()
}).refine(obj => Object.keys(obj).length > 0, "At least one field is required");

export const commentSchema = z.object({
  text: z.string().trim().min(1).max(2000)
});

export const statusSchema = z.object({
  status: z.enum(["Assigned", "In Progress", "Submitted", "Cleared", "Discrepant"])
});
