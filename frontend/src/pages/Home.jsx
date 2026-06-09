import { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import api from '../api/axios';

const Skeleton = () => (
  <div className="card overflow-hidden animate-pulse">
    <div className="aspect-[2/3] bg-gray-100" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-4/5" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  </div>
);

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    api.get('/movies')
      .then((r) => setMovies(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const genres = [...new Set(movies.flatMap((m) => m.genre?.split('/') ?? []).filter(Boolean))];
  const filtered = movies.filter((m) => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    const matchGenre = !genre || m.genre?.split('/').map(g => g.trim()).includes(genre);
    return matchSearch && matchGenre;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Hero banner */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12 mb-10 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1">
          <span className="inline-block bg-red-50 text-[#e50914] text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-wide uppercase border border-red-100">
            Now Showing
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-3">
            Book Your <span className="text-[#e50914]">Perfect</span> Seat
          </h1>
          <p className="text-gray-500 text-base max-w-md">
            Choose from the latest blockbusters, select your seats, and get instant confirmation.
          </p>
        </div>
        <div className="flex gap-4 text-center flex-shrink-0">
          {[{ val: '8+', label: 'Movies' }, { val: '4', label: 'Shows / Day' }, { val: '50', label: 'Seats / Show' }].map(({ val, label }) => (
            <div key={label} className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
              <div className="text-2xl font-bold text-[#e50914]">{val}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search movies…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="input-field sm:w-44"
        >
          <option value="">All Genres</option>
          {genres.map((g) => <option key={g} value={g}>{g.trim()}</option>)}
        </select>
      </div>

      {/* Count */}
      {!loading && (
        <p className="text-gray-400 text-sm mb-5">
          Showing {filtered.length} {filtered.length === 1 ? 'movie' : 'movies'}
          {(search || genre) && ' for your search'}
        </p>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <div className="text-5xl mb-3">🎬</div>
          <p className="text-gray-500 font-medium mb-1">No movies found</p>
          <p className="text-gray-400 text-sm mb-4">Try a different search or genre</p>
          <button
            onClick={() => { setSearch(''); setGenre(''); }}
            className="text-[#e50914] hover:text-red-700 text-sm font-medium transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      )}
    </div>
  );
}
