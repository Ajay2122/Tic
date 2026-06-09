import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#e50914] rounded-lg flex items-center justify-center shadow group-hover:scale-105 transition-transform">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
            </svg>
          </div>
          <span className="font-bold text-xl text-gray-900">CineBook</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/my-bookings"
                className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === '/my-bookings'
                    ? 'bg-red-50 text-[#e50914]'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                My Bookings
              </Link>
              <div className="flex items-center gap-2 ml-1">
                <div className="w-8 h-8 bg-[#e50914] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-700 text-sm hidden sm:block font-medium">{user.name?.split(' ')[0]}</span>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-sm text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-[#e50914] hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
