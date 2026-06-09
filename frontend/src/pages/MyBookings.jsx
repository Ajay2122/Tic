import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const PLACEHOLDER = (title) =>
  `https://placehold.co/80x120/f5f6fa/e50914?text=${encodeURIComponent(title ?? 'Movie')}`;

const fmtDate = (str) => {
  if (!str) return '';
  const d = new Date(str + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const fmtTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bookings/my')
      .then((r) => setBookings(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-400 text-sm mt-0.5">{bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'} total</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-secondary text-sm py-2 px-4"
        >
          + New Booking
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="card text-center py-20">
          <div className="text-5xl mb-4">🎟️</div>
          <h3 className="text-gray-800 font-semibold text-lg mb-2">No bookings yet</h3>
          <p className="text-gray-400 text-sm mb-6">Your confirmed tickets will appear here</p>
          <button onClick={() => navigate('/')} className="btn-primary inline-block">
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="card p-5 hover:shadow-md transition-shadow">
              <div className="flex gap-4">
                {/* Poster */}
                <img
                  src={b.poster_url || PLACEHOLDER(b.movie_title)}
                  alt={b.movie_title}
                  onError={(e) => { e.currentTarget.src = PLACEHOLDER(b.movie_title); }}
                  className="w-16 object-cover rounded-xl flex-shrink-0"
                  style={{ height: '88px' }}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="text-gray-900 font-bold leading-tight">{b.movie_title}</h3>
                      <p className="text-gray-500 text-sm mt-0.5">
                        {fmtDate(b.show_date?.split('T')[0])} • {fmtTime(b.show_time)}
                      </p>
                      {b.hall && <p className="text-gray-400 text-xs mt-0.5">{b.hall}</p>}
                    </div>
                    <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-semibold ${
                      b.status === 'confirmed'
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                    }`}>
                      {b.status === 'confirmed' ? '✓ ' : ''}{b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </div>

                  {/* Seats */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {b.seats?.map((seat) => (
                      <span key={seat} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono border border-gray-200">
                        {seat}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-gray-400 text-xs">Booking #{b.id}</span>
                    <span className="text-[#e50914] font-bold text-base">₹{b.total_amount}</span>
                  </div>
                </div>

                {/* Ticket icon */}
                <div className="hidden sm:flex flex-col items-center justify-center gap-1 border-l border-dashed border-gray-200 pl-4 flex-shrink-0">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
                    <svg className="w-5 h-5 text-[#e50914]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                    </svg>
                  </div>
                  <span className="text-gray-400 text-xs">{b.seats?.length} {b.seats?.length === 1 ? 'seat' : 'seats'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
