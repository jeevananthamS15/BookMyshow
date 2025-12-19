// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { Film, Search, User, LogOut, Menu, X, MapPin } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Film className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              BookMyShow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-red-400 transition-colors font-medium">
              Movies
            </Link>
            <button className="hover:text-red-400 transition-colors font-medium">
              Events
            </button>
            <button className="hover:text-red-400 transition-colors font-medium">
              Plays
            </button>
            <button className="hover:text-red-400 transition-colors font-medium">
              Sports
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Location */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">Mumbai</span>
            </div>

            {/* Search */}
            <div className="relative">
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 hover:bg-gray-700 rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              
              {searchOpen && (
                <div className="absolute right-0 top-14 w-80 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-4 animate-fadeIn">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for Movies, Events, Plays, Sports..." 
                    className="w-full px-4 py-3 bg-gray-900 rounded-lg border border-gray-700 focus:outline-none focus:border-red-500 transition-all text-white placeholder-gray-400"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* User Menu */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  to="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name || 'My Account'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-600 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  to="/login"
                  className="px-5 py-2 hover:bg-gray-700 rounded-lg transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors font-medium shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700 animate-fadeIn">
            <div className="space-y-3">
              <Link to="/" className="block px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors">
                Movies
              </Link>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors">
                Events
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors">
                Plays
              </button>
              <button className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors">
                Sports
              </button>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors">
                    My Bookings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="block px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-center">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}