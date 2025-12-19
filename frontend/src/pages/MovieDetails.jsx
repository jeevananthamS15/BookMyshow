// src/pages/MovieDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { Calendar, Clock, MapPin, Star, ChevronRight, Loader, Film } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();
  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [showsRes, movieRes] = await Promise.all([
        api.get(`/shows/movie/${id}`),
        api.get(`/movies/${id}`)
      ]);
      setShows(showsRes.data);
      setMovie(movieRes.data);
    } catch (err) {
      setError("Failed to load show details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading show times...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No shows available</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/"
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with Movie Info */}
      {movie && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 px-4 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Movie Poster */}
              <img 
                src={movie.poster} 
                alt={movie.title}
                className="w-48 h-72 object-cover rounded-xl shadow-2xl"
              />
              
              {/* Movie Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  {movie.rating && (
                    <div className="flex items-center space-x-2 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
                      <Star className="w-5 h-5 fill-current" />
                      <span>{movie.rating}/10</span>
                    </div>
                  )}
                  {movie.genre && (
                    <div className="px-4 py-2 bg-gray-700 rounded-full font-medium">
                      {movie.genre}
                    </div>
                  )}
                  {movie.language && (
                    <div className="px-4 py-2 bg-gray-700 rounded-full font-medium">
                      {movie.language}
                    </div>
                  )}
                </div>
                
                {movie.description && (
                  <p className="text-gray-300 text-lg mb-6">{movie.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shows Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Select Show Time</h2>
          <p className="text-gray-600">
            {shows.length} {shows.length === 1 ? 'show' : 'shows'} available
          </p>
        </div>

        {shows.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No shows available</h3>
            <p className="text-gray-600 mb-6">Check back later for new show times</p>
            <Link 
              to="/"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Browse Other Movies
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shows.map(show => (
              <ShowCard key={show._id} show={show} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Show Card Component
function ShowCard({ show }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100">
      <div className="p-6">
        {/* Theater Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
          {show.theater || "PVR Cinemas"}
        </h3>

        {/* Show Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-gray-600">
            <Calendar className="w-5 h-5 text-red-600" />
            <span className="font-medium">{formatDate(show.timing)}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <Clock className="w-5 h-5 text-red-600" />
            <span className="font-medium text-xl">{formatTime(show.timing)}</span>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-600">
            <MapPin className="w-5 h-5 text-red-600" />
            <span>Downtown, City Center</span>
          </div>
        </div>

        {/* Format Badge */}
        {show.format && (
          <div className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
            {show.format}
          </div>
        )}

        {/* Price */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-sm text-gray-500">Price per ticket</div>
            <div className="text-3xl font-bold text-gray-900">
              ₹{show.price || "250"}
            </div>
          </div>
        </div>

        {/* Book Button */}
        <Link
          to={`/seats/${show._id}`}
          className="block w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl text-center group"
        >
          <span className="flex items-center justify-center space-x-2">
            <span>Select Seats</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
      </div>

      {/* Availability Indicator */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-3 border-t border-green-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-700 font-medium">Available</span>
          <span className="text-green-600">Fast Filling</span>
        </div>
      </div>
    </div>
  );
}