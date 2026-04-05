const Record = require('../models/finRecords.model');

exports.getSummary = async (req, res) => {
  try {
    const match = {};

    const [typeTotals, categoryTotals, recentActivity, monthlyTrend] = await Promise.all([
      Record.aggregate([
        { $match: match },
        { $group: { _id: '$type', total: { $sum: '$amount' } } },
      ]),
      Record.aggregate([
        { $match: match },
        {
          $group: {
            _id: { category: '$category', type: '$type' },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { total: -1 } },
      ]),
      Record.find(match)
        .sort({ date: -1, createdAt: -1 })
        .limit(5)
        .select('amount type category date notes'),
      Record.aggregate([
        { $match: match },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
              type: '$type',
            },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    const totalIncome = typeTotals.find((x) => x._id === 'income')?.total || 0;
    const totalExpenses = typeTotals.find((x) => x._id === 'expense')?.total || 0;

    res.json({
      totals: {
        income: totalIncome,
        expenses: totalExpenses,
        netBalance: totalIncome - totalExpenses,
      },
      categoryTotals,
      recentActivity,
      monthlyTrend,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};