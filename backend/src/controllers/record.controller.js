const mongoose = require('mongoose');
const Record = require('../models/finRecords.model');

exports.createRecord = async (req, res) => {
  try {
    const record = await Record.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const { category, type, startDate, endDate, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (type) filter.type = type;

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [records, total] = await Promise.all([
      Record.find(filter).sort({ date: -1, createdAt: -1 }).skip(skip).limit(Number(limit)),
      Record.countDocuments(filter),
    ]);

    res.json({
      data: records,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)) || 1,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateRecord = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid record id' });
    }

    const filter = { _id: req.params.id };

    const updated = await Record.findOneAndUpdate(filter, req.body, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteRecord = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid record id' });
    }

    const filter = { _id: req.params.id };

    const deleted = await Record.findOneAndDelete(filter);
    if (!deleted) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};