const router = require('express').Router();
const pool = require('../config/db');

router.get('/movie/:movieId', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT s.*, m.title AS movie_title, m.poster_url
       FROM showtimes s
       JOIN movies m ON s.movie_id = m.id
       WHERE s.movie_id = $1 AND s.show_date >= CURRENT_DATE
       ORDER BY s.show_date, s.show_time`,
      [req.params.movieId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT s.*, m.title AS movie_title, m.poster_url, m.genre, m.duration
       FROM showtimes s
       JOIN movies m ON s.movie_id = m.id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Showtime not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/seats', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM seats WHERE showtime_id = $1 ORDER BY row_letter, seat_number',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
