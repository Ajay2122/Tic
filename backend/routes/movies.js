const router = require('express').Router();
const pool = require('../config/db');

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM movies ORDER BY rating DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM movies WHERE id = $1', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Movie not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
