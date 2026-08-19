import { Case } from "../models/Case.js";

export async function getDashboardOverview(req, res, next) {
  try {
    const filter = {};

    // Agent sees only their cases
    if (req.user.role === "AGENT") {
      filter.agent = req.user._id;
    }

    const [totalCases, statusCounts] = await Promise.all([
      Case.countDocuments(filter),

      Case.aggregate([
        {
          $match: filter,
        },
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]),
    ]);

    const statuses = {
      New: 0,
      Assigned: 0,
      "In Progress": 0,
      Submitted: 0,
      Cleared: 0,
      Discrepant: 0,
    };

    statusCounts.forEach((item) => {
      statuses[item._id] = item.count;
    });

    res.status(200).json({
      totalCases,
      statuses,
    });
  } catch (error) {
    next(error);
  }
}