# CineBook — PERN Movie Ticket Booking

Full-stack movie ticket booking app built with **PostgreSQL + Express + React + Node.js**.

## Stack
- **Backend**: Node.js, Express, PostgreSQL (`pg`), JWT auth, bcryptjs
- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios

## Project Structure
```
movie-booking/
├── backend/
│   ├── config/db.js          # PostgreSQL pool
│   ├── middleware/auth.js     # JWT middleware
│   ├── routes/
│   │   ├── auth.js            # Register / Login / Me
│   │   ├── movies.js          # List / Get movie
│   │   ├── showtimes.js       # Showtimes by movie, by ID, seats
│   │   └── bookings.js        # Create booking, My bookings
│   ├── schema.sql             # Tables + seed data
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/axios.js
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── MovieCard.jsx
    │   │   └── SeatMap.jsx
    │   └── pages/
    │       ├── Home.jsx
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── MovieDetail.jsx
    │       ├── Booking.jsx
    │       └── MyBookings.jsx
    └── package.json
```

## Setup

### 1. PostgreSQL Database
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE moviebooking;"

# Run schema + seed
psql -U postgres -d moviebooking -f backend/schema.sql
```

### 2. Backend
```bash
cd backend
npm install

# Copy env file and fill in your values
copy .env.example .env
# Edit .env: set DATABASE_URL and JWT_SECRET

npm run dev    # starts on http://localhost:3001
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev    # starts on http://localhost:5173
```

## Features
- JWT-based register / login
- Browse movies with search & genre filter
- View showtimes by date for each movie
- Interactive seat map (5 rows × 10 seats)
- Transactional booking with seat locking
- My Bookings page with ticket details

## API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✓ | Current user |
| GET | /api/movies | — | All movies |
| GET | /api/movies/:id | — | Movie by ID |
| GET | /api/showtimes/movie/:id | — | Showtimes for movie |
| GET | /api/showtimes/:id | — | Showtime by ID |
| GET | /api/showtimes/:id/seats | — | Seats for showtime |
| POST | /api/bookings | ✓ | Create booking |
| GET | /api/bookings/my | ✓ | My bookings |
