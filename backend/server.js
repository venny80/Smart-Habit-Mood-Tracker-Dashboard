const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const habitsRouter = require('./routes/habits');
const moodsRouter = require('./routes/moods');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api/habits', habitsRouter);
app.use('/api/moods', moodsRouter);

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
