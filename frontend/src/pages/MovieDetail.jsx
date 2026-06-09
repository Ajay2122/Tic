import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PLACEHOLDER = (title) =>
  `https://placehold.co/300x450/f5f6fa/e50914?text=${encodeURIComponent(title)}`;

const fmtDate = (str) => {
  const d = new Date(str + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const fmtTime = (t) => {
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/movies/${id}`), api.get(`/showtimes/movie/${id}`)])
      .then(([mRes, sRes]) => {
        setMovie(mRes.data);
        setShowtimes(sRes.data);
        if (sRes.data.length) setSelectedDate(sRes.data[0].show_date.split('T')[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!movie) return (
    <div className="text-center py-24">
      <div className="text-5xl mb-4">🎬</div>
      <p className="text-gray-500 mb-4">Movie not found</p>
      <button onClick={() => navigate('/')} className="text-[#e50914] hover:underline font-medium">Back to Home</button>
    </div>
  );

  const uniqueDates = [...new Set(showtimes.map((s) => s.show_date.split('T')[0]))].sort();
  const dayShowtimes = showtimes.filter((s) => s.show_date.split('T')[0] === selectedDate);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 text-sm mb-6 font-medium transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Movie header card */}
      <div className="card p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-48 flex-shrink-0">
            <img
              src={movie.poster_url || PLACEHOLDER(movie.title)}
              alt={movie.title}
              onError={(e) => { e.currentTarget.src = PLACEHOLDER(movie.title); }}
              className="w-full rounded-xl shadow-md"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">{movie.title}</h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre?.split('/').map((g) => (
                <span key={g} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">{g.trim()}</span>
              ))}
              <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">{movie.duration} min</span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-xl">
                <span className="text-yellow-500 text-base">★</span>
                <span className="text-gray-800 font-bold">{movie.rating}</span>
                <span className="text-gray-400 text-xs">/10</span>
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed text-sm">{movie.description}</p>
          </div>
        </div>
      </div>

      {/* Showtimes */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-[#e50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Choose a Showtime
        </h2>

        {/* Date tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-5">
          {uniqueDates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedDate === date
                  ? 'bg-[#e50914] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              {fmtDate(date)}
            </button>
          ))}
        </div>

        {dayShowtimes.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No shows available for this date</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {dayShowtimes.map((show) => {
              const full = show.available_seats === 0;
              return (
                <button
                  key={show.id}
                  disabled={full}
                  onClick={() => navigate(`/booking/${show.id}`)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    full
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50 hover:shadow-sm cursor-pointer'
                  }`}
                >
                  <div className="text-gray-900 font-bold text-sm">{fmtTime(show.show_time)}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{show.hall}</div>
                  <div className="text-[#e50914] font-bold text-sm mt-2">₹{show.price}</div>
                  <div className={`text-xs mt-1 font-medium ${
                    full ? 'text-gray-400' : show.available_seats < 10 ? 'text-orange-500' : 'text-green-600'
                  }`}>
                    {full ? 'Houseful' : `${show.available_seats} left`}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
