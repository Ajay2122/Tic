import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SeatMap from '../components/SeatMap';
import api from '../api/axios';

const PLACEHOLDER = (title) =>
  `https://placehold.co/80x120/f5f6fa/e50914?text=${encodeURIComponent(title ?? 'Movie')}`;

const fmtTime = (t) => {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
};

const fmtDate = (str) => {
  if (!str) return '';
  const d = new Date(str + 'T00:00:00');
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return 'Today';
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

export default function Booking() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/showtimes/${showtimeId}`),
      api.get(`/showtimes/${showtimeId}/seats`),
    ])
      .then(([stRes, seatsRes]) => {
        setShowtime(stRes.data);
        setSeats(seatsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [showtimeId]);

  const toggle = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  const confirm = async () => {
    if (!selected.length) return setError('Please select at least one seat');
    setBooking(true); setError('');
    try {
      await api.post('/bookings', { showtime_id: Number(showtimeId), seat_ids: selected });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (success) return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-[#f5f6fa]">
      <div className="text-center max-w-sm bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
        <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Booking Confirmed!</h2>
        <p className="text-gray-600 font-medium mb-1">{showtime?.movie_title}</p>
        <p className="text-gray-400 text-sm mb-7">
          {fmtDate(showtime?.show_date?.split('T')[0])} • {fmtTime(showtime?.show_time)} • {showtime?.hall}
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/my-bookings')} className="btn-primary">
            View Bookings
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Home
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const selectedSeatObjs = seats.filter((s) => selected.includes(s.id));
  const total = showtime ? Number(showtime.price) * selected.length : 0;

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

      {/* Show info bar */}
      {showtime && (
        <div className="card p-4 mb-6 flex items-center gap-4">
          <img
            src={showtime.poster_url || PLACEHOLDER(showtime.movie_title)}
            alt={showtime.movie_title}
            onError={(e) => { e.currentTarget.src = PLACEHOLDER(showtime.movie_title); }}
            className="w-11 h-15 object-cover rounded-lg flex-shrink-0"
            style={{ height: '60px' }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-gray-900 font-bold truncate">{showtime.movie_title}</h2>
            <p className="text-gray-500 text-sm">
              {fmtDate(showtime.show_date?.split('T')[0])} • {fmtTime(showtime.show_time)} • {showtime.hall}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[#e50914] font-bold">₹{showtime.price}</div>
            <div className="text-gray-400 text-xs">per seat</div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Seat map */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-gray-900 font-bold mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#e50914]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 18v-2H2v-2h2V8H2V6h2V4h2v2h12V4h2v2h2v2h-2v6h2v2h-2v2h-2v2H6v-2H4zm2-2h12V8H6v8z"/>
            </svg>
            Select Your Seats
          </h3>
          {seats.length ? (
            <SeatMap seats={seats} selectedSeats={selected} onSeatToggle={toggle} />
          ) : (
            <p className="text-gray-400 text-center py-10">No seats available</p>
          )}
        </div>

        {/* Summary */}
        <div className="card p-6 h-fit lg:sticky lg:top-20">
          <h3 className="text-gray-900 font-bold mb-5">Order Summary</h3>

          {selectedSeatObjs.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
              <div className="text-3xl mb-2">🪑</div>
              <p className="text-gray-400 text-sm">Click on seats to select them</p>
            </div>
          ) : (
            <div className="space-y-4 mb-5">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Selected Seats</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSeatObjs.map((s) => (
                    <span
                      key={s.id}
                      onClick={() => toggle(s.id)}
                      className="bg-red-50 text-[#e50914] text-xs px-2.5 py-1 rounded-lg cursor-pointer hover:bg-red-100 transition-colors font-semibold border border-red-100"
                      title="Click to deselect"
                    >
                      {s.row_letter}{s.seat_number}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{selected.length} seat{selected.length > 1 ? 's' : ''} × ₹{showtime?.price}</span>
                  <span className="text-gray-700 font-medium">₹{total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Convenience fee</span>
                  <span className="text-green-600 text-xs font-semibold">FREE</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-gray-900 font-bold">Total</span>
                <span className="text-[#e50914] font-extrabold text-xl">₹{total}</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <button
            onClick={confirm}
            disabled={!selected.length || booking}
            className="btn-primary w-full"
          >
            {booking ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Processing…
              </span>
            ) : selected.length ? `Confirm & Pay ₹${total}` : 'Select Seats to Continue'}
          </button>

          <p className="text-center text-gray-400 text-xs mt-3">
            🔒 Secure booking • Instant confirmation
          </p>
        </div>
      </div>
    </div>
  );
}
