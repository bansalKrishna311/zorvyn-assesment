require('dotenv').config();

const app = require('../src/app');
const connectToDatabase = require('../src/config/db');

module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return res.status(500).json({ msg: 'Database connection failed' });
  }
};
