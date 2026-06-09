-- =========================================
-- Movie Booking Schema + Seed Data
-- Run: psql -U postgres -d moviebooking -f schema.sql
-- =========================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  genre VARCHAR(100),
  duration INTEGER,
  poster_url TEXT,
  rating DECIMAL(3,1),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS showtimes (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 50,
  available_seats INTEGER NOT NULL DEFAULT 50,
  price DECIMAL(10,2) NOT NULL DEFAULT 250.00,
  hall VARCHAR(50) DEFAULT 'Hall 1'
);

CREATE TABLE IF NOT EXISTS seats (
  id SERIAL PRIMARY KEY,
  showtime_id INTEGER REFERENCES showtimes(id) ON DELETE CASCADE,
  seat_number INTEGER NOT NULL,
  row_letter CHAR(1) NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  UNIQUE(showtime_id, row_letter, seat_number)
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  showtime_id INTEGER REFERENCES showtimes(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS booking_seats (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id INTEGER REFERENCES seats(id)
);

-- =========================================
-- Seed Movies
-- =========================================
INSERT INTO movies (title, description, genre, duration, poster_url, rating) VALUES
('Avengers: Endgame',
 'After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos'' actions and restore balance to the universe.',
 'Action/Sci-Fi', 181, 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', 8.4),

('The Dark Knight',
 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
 'Action/Crime', 152, 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 9.0),

('Inception',
 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
 'Sci-Fi/Thriller', 148, 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 8.8),

('Interstellar',
 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity''s survival.',
 'Sci-Fi/Drama', 169, 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', 8.6),

('Spider-Man: No Way Home',
 'With Spider-Man''s identity now revealed, Peter Parker asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds appear.',
 'Action/Sci-Fi', 148, 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', 8.2),

('Top Gun: Maverick',
 'After more than thirty years of service as one of the Navy''s top aviators, Maverick is pushed to train a detachment of Top Gun graduates for a specialized mission.',
 'Action/Drama', 130, 'https://image.tmdb.org/t/p/w500/62HCnUTHJl4ytIFiFlkT6hJkgn.jpg', 8.3),

('Doctor Strange in the Multiverse of Madness',
 'Doctor Strange teams with a mysterious new ally who has the ability to travel between multiverses. Together they face a powerful adversary threatening to wipe out reality.',
 'Action/Fantasy', 126, 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', 7.1),

('The Batman',
 'In his second year of fighting crime, Batman uncovers corruption in Gotham while pursuing a serial killer known as the Riddler.',
 'Action/Crime', 176, 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', 7.8)
ON CONFLICT DO NOTHING;

-- =========================================
-- Seed Showtimes + Seats for next 7 days
-- =========================================
DO $$
DECLARE
  movie_rec RECORD;
  d INTEGER;
  show_times TEXT[] := ARRAY['10:00', '13:30', '17:00', '20:30'];
  t TEXT;
  prices NUMERIC[] := ARRAY[199, 249, 299, 349];
  halls TEXT[] := ARRAY['Hall 1', 'Hall 2', 'Hall 3', 'IMAX Hall'];
  new_showtime_id INTEGER;
  row_char TEXT;
  seat_num INTEGER;
  all_rows TEXT[] := ARRAY['A', 'B', 'C', 'D', 'E'];
BEGIN
  FOR movie_rec IN SELECT id FROM movies LOOP
    FOR d IN 0..6 LOOP
      FOREACH t IN ARRAY show_times LOOP
        INSERT INTO showtimes (movie_id, show_date, show_time, total_seats, available_seats, price, hall)
        VALUES (
          movie_rec.id,
          CURRENT_DATE + d,
          t::TIME,
          50,
          50,
          prices[(floor(random() * 4) + 1)::int],
          halls[(floor(random() * 4) + 1)::int]
        )
        RETURNING id INTO new_showtime_id;

        FOREACH row_char IN ARRAY all_rows LOOP
          FOR seat_num IN 1..10 LOOP
            INSERT INTO seats (showtime_id, seat_number, row_letter, is_booked)
            VALUES (new_showtime_id, seat_num, row_char, FALSE)
            ON CONFLICT DO NOTHING;
          END LOOP;
        END LOOP;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
