require('dotenv').config();

const app = require('../src/app');
const connectToDatabase = require('../src/config/db');

module.exports = async (req, res) => {
  await connectToDatabase();
  return app(req, res);
};
