// src/pages/Home.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import MovieCard from "../components/MovieCard";
import { Film, TrendingUp, Clock, Loader } from "lucide-react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await api.get("/movies");
        setMovies(res.data);
      } catch (err) {
        setError("Failed to load movies. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const filters = [
    { id: "all", label: "All Movies", icon: Film },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "upcoming", label: "Coming Soon", icon: Clock },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Film className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16 px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Welcome to BookMyShow</h1>
          <p className="text-xl text-red-100 mb-8">
            Book tickets for the latest movies, events, and shows
          </p>
          
          {/* Filter Tabs */}
          <div className="flex space-x-4">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  filter === f.id 
                    ? 'bg-white text-red-600 shadow-lg' 
                    : 'bg-red-700 hover:bg-red-800 text-white'
                }`}
              >
                <f.icon className="w-5 h-5" />
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {filter === "all" ? "Now Showing" : filter === "trending" ? "Trending Now" : "Coming Soon"}
          </h2>
          <p className="text-gray-600">
            {movies.length} {movies.length === 1 ? 'movie' : 'movies'} available
          </p>
        </div>

        {movies.length === 0 ? (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No movies available</h3>
            <p className="text-gray-600">Check back soon for new releases!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {movies.map(movie => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}