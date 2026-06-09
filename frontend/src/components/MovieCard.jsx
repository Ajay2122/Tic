import { Link } from 'react-router-dom';

const PLACEHOLDER = (title) =>
  `https://placehold.co/300x450/f5f6fa/e50914?text=${encodeURIComponent(title)}`;

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="group block">
      <div className="card overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
          <img
            src={movie.poster_url || PLACEHOLDER(movie.title)}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER(movie.title); }}
          />
          {/* Rating */}
          <div className="absolute top-2 right-2 bg-white/90 text-yellow-500 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-0.5 shadow-sm">
            <span>★</span>
            <span className="text-gray-800">{movie.rating}</span>
          </div>
          {/* Genre */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 pb-3 pt-6">
            <span className="text-xs text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded">
              {movie.genre?.split('/')[0]}
            </span>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#e50914]/0 group-hover:bg-[#e50914]/10 transition-colors duration-200 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-[#e50914] text-white text-xs font-bold px-3 py-1.5 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow-lg">
              Book Now
            </span>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-gray-900 font-semibold text-sm truncate">{movie.title}</h3>
          <p className="text-gray-400 text-xs mt-0.5">{movie.duration} min</p>
        </div>
      </div>
    </Link>
  );
}
