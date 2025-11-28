const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/moods?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', (req, res) => {
  const { from, to } = req.query;
  let sql = 'SELECT * FROM mood_entries';
  const params = [];

  if (from && to) {
    sql += ' WHERE date BETWEEN ? AND ?';
    params.push(from, to);
  }

  sql += ' ORDER BY date DESC';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/moods/:id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM mood_entries WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

// POST /api/moods
router.post('/', (req, res) => {
  const { date, mood, mood_score, note, habit_done } = req.body;
  if (!date || !mood) return res.status(400).json({ error: 'date and mood are required' });

  db.run(
    'INSERT INTO mood_entries (date, mood, mood_score, note, habit_done) VALUES (?,?,?,?,?)',
    [date, mood, mood_score || null, note || '', habit_done ? 1 : 0],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      db.get('SELECT * FROM mood_entries WHERE id = ?', [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(row);
      });
    }
  );
});

// PUT /api/moods/:id
router.put('/:id', (req, res) => {
  const { date, mood, mood_score, note, habit_done } = req.body;
  db.run(
    'UPDATE mood_entries SET date=?, mood=?, mood_score=?, note=?, habit_done=? WHERE id=?',
    [date, mood, mood_score || null, note || '', habit_done ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE /api/moods/:id
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM mood_entries WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
