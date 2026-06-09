const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const client = await pool.connect();
  try {
    const { showtime_id, seat_ids } = req.body;
    if (!showtime_id || !seat_ids?.length)
      return res.status(400).json({ error: 'showtime_id and seat_ids are required' });

    await client.query('BEGIN');

    const seatsResult = await client.query(
      'SELECT * FROM seats WHERE id = ANY($1::int[]) AND showtime_id = $2 FOR UPDATE',
      [seat_ids, showtime_id]
    );

    if (seatsResult.rows.length !== seat_ids.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Invalid seat selection' });
    }

    const alreadyBooked = seatsResult.rows.filter((s) => s.is_booked);
    if (alreadyBooked.length) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'One or more seats are already booked' });
    }

    const showtimeRes = await client.query('SELECT price FROM showtimes WHERE id = $1', [showtime_id]);
    const price = showtimeRes.rows[0]?.price;
    if (!price) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Showtime not found' });
    }

    const total_amount = price * seat_ids.length;

    const bookingRes = await client.query(
      'INSERT INTO bookings (user_id, showtime_id, total_amount, status) VALUES ($1,$2,$3,$4) RETURNING *',
      [req.user.id, showtime_id, total_amount, 'confirmed']
    );
    const booking = bookingRes.rows[0];

    await client.query('UPDATE seats SET is_booked = true WHERE id = ANY($1::int[])', [seat_ids]);

    for (const seat_id of seat_ids) {
      await client.query(
        'INSERT INTO booking_seats (booking_id, seat_id) VALUES ($1, $2)',
        [booking.id, seat_id]
      );
    }

    await client.query(
      'UPDATE showtimes SET available_seats = available_seats - $1 WHERE id = $2',
      [seat_ids.length, showtime_id]
    );

    await client.query('COMMIT');
    res.status(201).json(booking);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Booking failed' });
  } finally {
    client.release();
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         b.id, b.total_amount, b.status, b.created_at,
         s.show_date, s.show_time, s.hall,
         m.title AS movie_title, m.poster_url,
         array_agg(st.row_letter || st.seat_number::text ORDER BY st.row_letter, st.seat_number) AS seats
       FROM bookings b
       JOIN showtimes s ON b.showtime_id = s.id
       JOIN movies m ON s.movie_id = m.id
       JOIN booking_seats bs ON b.id = bs.booking_id
       JOIN seats st ON bs.seat_id = st.id
       WHERE b.user_id = $1
       GROUP BY b.id, s.show_date, s.show_time, s.hall, m.title, m.poster_url
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
