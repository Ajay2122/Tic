CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movies (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  genre VARCHAR(100),
  duration INTEGER,
  release_date DATE,
  poster_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE theaters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(255),
  total_seats INTEGER NOT NULL
);

CREATE TABLE showtimes (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  theater_id INTEGER REFERENCES theaters(id) ON DELETE CASCADE,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  available_seats INTEGER NOT NULL
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  showtime_id INTEGER REFERENCES showtimes(id) ON DELETE CASCADE,
  seats INTEGER NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed',
  booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
