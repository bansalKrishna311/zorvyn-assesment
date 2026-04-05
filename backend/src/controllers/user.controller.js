const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user.model');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ msg: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      isActive,
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role, isActive } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (typeof isActive !== 'undefined') {
      filter.isActive = isActive === 'true';
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: 'Invalid user id' });
    }

    const { name, role, isActive, password } = req.body;
    const update = {};

    if (typeof name !== 'undefined') update.name = name;
    if (typeof role !== 'undefined') update.role = role;
    if (typeof isActive !== 'undefined') update.isActive = isActive;

    if (password) {
      update.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      returnDocument: 'after',
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
