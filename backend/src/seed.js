import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.js";
import { Case } from "./models/Case.js";
const seed = async () => {
  try{
await connectDB();

const managerPassword = await bcrypt.hash("Manager@123", 12);
const agentPassword = await bcrypt.hash("Agent@123", 12);

const manager = await User.findOneAndUpdate(
  { email: "manager@demo.com" },
  { name: "Rohit Manager", email: "manager@demo.com", passwordHash: managerPassword, role: "MANAGER", isActive: true },
  { upsert: true, new: true }
);

const agent = await User.findOneAndUpdate(
  { email: "agent@demo.com" },
  { name: "John Doe", email: "agent@demo.com", passwordHash: agentPassword, role: "AGENT", isActive: true },
  { upsert: true, new: true }
);

if (await Case.countDocuments() === 0) {
  await Case.create([
    {
      clientName: "Acme Corp",
      subjectName: "Contract Review",
      caseType: "Legal",
      dueDate: new Date(Date.now() + 4 * 86400000),
      description: "Review and validate contract documents.",
      status: "In Progress",
      agent: agent._id,
      createdBy: manager._id
    },
    {
      clientName: "Initech",
      subjectName: "KYC Process",
      caseType: "Compliance",
      dueDate: new Date(Date.now() + 8 * 86400000),
      description: "Collect supporting KYC documents.",
      status: "Submitted",
      agent: agent._id,
      createdBy: manager._id
    },
    {
      clientName: "Wayne Enterprises",
      subjectName: "Background Check",
      caseType: "HR",
      dueDate: new Date(Date.now() + 2 * 86400000),
      status: "New",
      createdBy: manager._id
    }
  ]);
}

console.log("Seed complete.");
process.exit(0);
}catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
};

seed();
