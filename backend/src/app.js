const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/records', require('./routes/record.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));

app.use((req, res) => {
	res.status(404).json({ msg: 'Route not found' });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500).json({ msg: err.message || 'Server error' });
});

module.exports = app;