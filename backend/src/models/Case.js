import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  caseId: { type: String, unique: true, index: true },
  clientName: { type: String, required: true, trim: true },
  subjectName: { type: String, required: true, trim: true },
  caseType: { type: String, required: true, trim: true },
  dueDate: { type: Date, required: true },
  description: { type: String, trim: true, maxlength: 3000 },
  status: {
    type: String,
    enum: ["New", "Assigned", "In Progress", "Submitted", "Cleared", "Discrepant"],
    default: "New",
    index: true
  },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

caseSchema.pre("save", async function(next) {
  if (!this.caseId) {
    const count = await mongoose.model("Case").countDocuments();
    this.caseId = `CASE-${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

export const Case = mongoose.model("Case", caseSchema);
