// src/pages/Dashboard.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { Ticket, Calendar, MapPin, Clock, Download, Share2, Loader, AlertCircle, Film } from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/bookings/me");
        setBookings(res.data);
      } catch (err) {
        setError("Failed to load bookings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-12 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-red-100">
            Welcome back, {user?.name || "Guest"}! Here are your ticket bookings.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {error ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Bookings</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <Film className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Bookings Yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't made any bookings yet. Start exploring movies and book your tickets!
            </p>
            <button 
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all shadow-lg"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
              </h2>
            </div>

            {bookings.map(booking => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Booking Card Component
function BookingCard({ booking }) {
  const [showQR, setShowQR] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isUpcoming = () => {
    return new Date(booking.showTime) > new Date();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden border border-gray-100">
      <div className="flex flex-col md:flex-row">
        {/* Movie Poster */}
        {booking.movie?.poster && (
          <div className="md:w-48 h-64 md:h-auto">
            <img 
              src={booking.movie.poster} 
              alt={booking.movie?.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      

        {/* Booking Details */}
        <div className="flex-1 p-6">
          {/* Status Badge */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {booking.movie?.title || "Movie Title"}
              </h3>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  isUpcoming() 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {isUpcoming() ? 'Upcoming' : 'Completed'}
                </span>
                {booking.format && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                    {booking.format}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Show Details */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-sm text-gray-500">Theater</div>
                  <div className="font-semibold text-gray-900">
                    {booking.theater || "PVR Cinemas"}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-sm text-gray-500">Show Date</div>
                  <div className="font-semibold text-gray-900">
                    {formatDate(booking.showTime || booking.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <Clock className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-sm text-gray-500">Show Time</div>
                  <div className="font-semibold text-gray-900">
                    {formatTime(booking.showTime || booking.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-gray-600">
                <Ticket className="w-5 h-5 text-red-600" />
                <div>
                  <div className="text-sm text-gray-500">Seats</div>
                  <div className="font-semibold text-gray-900">
                    {booking.seats?.join(", ") || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking ID & Amount */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <div>
              <div className="text-sm text-gray-500">Booking ID</div>
              <div className="font-mono text-gray-900 font-semibold">
                {booking._id?.slice(-8).toUpperCase() || "N/A"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Amount</div>
              <div className="text-2xl font-bold text-red-600">
                ₹{booking.totalAmount || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="md:w-48 bg-gray-50 p-6 flex flex-col justify-center space-y-3 border-l border-gray-200">
          <button 
            onClick={() => setShowQR(!showQR)}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <Ticket className="w-5 h-5" />
            <span>View Ticket</span>
          </button>
          
          <button className="w-full px-4 py-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Download</span>
          </button>
          
          <button className="w-full px-4 py-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* QR Code Section */}
      {showQR && (
        <div className="border-t border-gray-200 bg-gradient-to-r from-red-50 to-pink-50 p-6 animate-fadeIn">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Show this QR code at the theater entrance
            </p>
            <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <Ticket className="w-16 h-16 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}