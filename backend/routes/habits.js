const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/habits
router.get('/', (req, res) => {
  db.all('SELECT * FROM habits ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/habits/:id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM habits WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

// POST /api/habits
router.post('/', (req, res) => {
  const { title, frequency, target, category } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  db.run(
    'INSERT INTO habits (title, frequency, target, category) VALUES (?,?,?,?)',
    [title, frequency || 'daily', target || 1, category || 'general'],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      db.get('SELECT * FROM habits WHERE id = ?', [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.json(row);
      });
    }
  );
});

// PUT /api/habits/:id
router.put('/:id', (req, res) => {
  const { title, frequency, target, category, streak } = req.body;
  db.run(
    'UPDATE habits SET title=?, frequency=?, target=?, category=?, streak=? WHERE id=?',
    [title, frequency, target, category, streak || 0, req.params.id],
    function (err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// DELETE /api/habits/:id
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM habits WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

// POST /api/habits/:id/increment
router.post('/:id/increment', (req, res) => {
  db.run('UPDATE habits SET streak = COALESCE(streak,0) + 1 WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT * FROM habits WHERE id = ?', [req.params.id], (e, row) => {
      if (e) return res.status(500).json({ error: e.message });
      res.json(row);
    });
  });
});

module.exports = router;
