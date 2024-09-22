import ApiUsage from "../../models/apiUsage.js";

const apiUsage = async (req, res) => {
  try {
    const usageStats = await ApiUsage.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            endpoint: "$endpoint",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 }, // Sort by most-used endpoints
      },
    ]);
    return res.status(200).json({ success: true, Data: usageStats});
  } catch (error) {
    return res.status(500).json({ success:false, message: 'An error occurred while fetching API usage stats.' });
  }
};


export default apiUsage;