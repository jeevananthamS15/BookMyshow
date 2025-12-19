// src/components/MovieCard.jsx
import { Link } from "react-router-dom";
import { Star, Play } from "lucide-react";
import { useState } from "react";

export default function MovieCard({ movie }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={`/movie/${movie._id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative block overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      {/* Movie Poster */}
      <div className="relative h-96 overflow-hidden bg-gray-900">
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
        
        {/* Rating Badge */}
        {movie.rating && (
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            <Star className="w-4 h-4 fill-current" />
            <span>{movie.rating}</span>
          </div>
        )}

        {/* Play Icon on Hover */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform scale-100 group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white fill-current ml-1" />
          </div>
        </div>

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 transform transition-transform duration-300">
          <h3 className="text-white text-xl font-bold mb-2 line-clamp-2">
            {movie.title}
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genre && (
              <span className="px-3 py-1 bg-gray-800 bg-opacity-70 backdrop-blur-sm text-gray-200 rounded-full text-xs font-medium">
                {movie.genre}
              </span>
            )}
            {movie.language && (
              <span className="px-3 py-1 bg-gray-800 bg-opacity-70 backdrop-blur-sm text-gray-200 rounded-full text-xs font-medium">
                {movie.language}
              </span>
            )}
          </div>
          
          {/* Book Now Button */}
          <button 
            className={`w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Book Tickets
          </button>
        </div>
      </div>
    </Link>
  );
}