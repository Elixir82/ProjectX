import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

// Hamburger SVG
const Burger = ({ open, onClick }) => (
  <button
    aria-label="Toggle navigation menu"
    className="md:hidden p-2 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
    tabIndex={0}
    onClick={onClick}
  >
    {open ? (
      // Close icon
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-white">
        <path
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ) : (
      // Burger icon
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" className="text-white">
        <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  </button>
);

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  // Auto-close mobile menu on nav
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Utility for active link highlighting
  const isActive = (to, startsWith = false) =>
    startsWith
      ? location.pathname.startsWith(to)
      : location.pathname === to;

  return (
    <nav className="bg-gradient-to-r from-pink-500/90 via-pink-400/80 to-rose-300/80 shadow-2xl sticky top-0 z-30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
        <div className="flex justify-between items-center h-16 md:h-[4.2rem] relative">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 md:gap-8">
            <Link
              to="/crush"
              className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2 text-white drop-shadow"
            >
              <span role="img" aria-label="love">💘</span>
              RegMatch
            </Link>
          </div>

          {/* Hamburger MOBILE */}
          <div className="flex md:hidden">
            <Burger open={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
          </div>

          {/* --- DESKTOP NAV --- */}
          <div className="hidden md:flex gap-2 ml-4 items-center">
            <Link
              to="/crush"
              className={`
                px-5 py-2 rounded-full font-semibold text-base transition-all duration-150 shadow-sm
                ${isActive('/crush')
                  ? 'bg-white text-pink-600 scale-105 shadow'
                  : 'text-white hover:bg-white/30 hover:text-pink-50'
                }
              `}
            >
              Find Crushes
            </Link>
            <Link
              to="/confessions"
              className={`
                px-5 py-2 rounded-full font-semibold text-base transition-all duration-150 shadow-sm
                ${isActive('/confessions') ? 'bg-white text-pink-600 scale-105 shadow'
                  : 'text-white hover:bg-white/30 hover:text-pink-50'
                }
              `}
            >
              Confessions/Rants
            </Link>
          </div>

          {/* --- DESKTOP LOGIN/LOGOUT --- */}
          <div className="hidden md:block">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-white/90 text-pink-700 hover:bg-white/70 hover:text-pink-900 px-4 py-2 rounded-full font-semibold text-base shadow ring-1 ring-pink-200 transition-all"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-white/90 text-pink-700 hover:bg-rose-100 hover:text-pink-900 px-4 py-2 rounded-full font-semibold text-base shadow ring-1 ring-pink-200 transition-all"
              >
                Logout
              </button>
            )}
          </div>

          {/* --- MOBILE MENU DROPDOWN --- */}
          <div
            className={`${
              menuOpen ? 'flex' : 'hidden'
            } md:hidden flex-col gap-2 absolute top-16 left-0 right-0 bg-gradient-to-br from-pink-500/95 via-pink-400/90 to-rose-300/90 shadow-xl rounded-b-3xl px-3 pt-3 pb-5 transition-all z-40`}
          >
            <Link
              to="/crush"
              className={`
                w-full block text-left px-5 py-3 rounded-xl font-semibold text-base transition
                ${isActive('/crush')
                  ? 'bg-white text-pink-600'
                  : 'text-white hover:bg-white/30 hover:text-pink-50'
                }
              `}
              onClick={() => setMenuOpen(false)}
            >
              Find Crushes
            </Link>
            <Link
              to="/confessions"
              className={`
                w-full block text-left px-5 py-3 rounded-xl font-semibold text-base transition
                ${isActive('/confessions')
                  ? 'bg-white text-pink-600'
                  : 'text-white hover:bg-white/30 hover:text-pink-50'
                }
              `}
              onClick={() => setMenuOpen(false)}
            >
              Confessions
            </Link>
            <Link
              to="/rants"
              className={`
                w-full block text-left px-5 py-3 rounded-xl font-semibold text-base transition
                ${isActive('/rants')
                  ? 'bg-white text-pink-600'
                  : 'text-white hover:bg-white/30 hover:text-pink-50'
                }
              `}
              onClick={() => setMenuOpen(false)}
            >
              Rants
            </Link>
            <div className="mt-2">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="block w-full bg-white/90 text-pink-700 hover:bg-white/70 hover:text-pink-900 px-4 py-2 rounded-full font-semibold text-base shadow ring-1 ring-pink-200 transition-all"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="block w-full bg-white/90 text-pink-700 hover:bg-rose-100 hover:text-pink-900 px-4 py-2 rounded-full font-semibold text-base shadow ring-1 ring-pink-200 transition-all"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
