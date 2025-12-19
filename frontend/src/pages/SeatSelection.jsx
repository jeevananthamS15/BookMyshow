// src/pages/SeatSelection.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import SeatGrid from "../components/SeatGrid";
import { CreditCard, Loader, AlertCircle, ChevronLeft, Clock, MapPin, Calendar, Ticket } from "lucide-react";

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/shows/show/${showId}`);
        setShow(res.data);

      } catch (err) {
        setError("Failed to load show details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [showId]);

  const toggleSeat = (seat) => {
    setSelected(prev => 
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
  };

  const book = async () => {
    if (selected.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    try {
      setBooking(true);
      await api.post("/bookings", { 
        showId, 
        seats: selected,
        totalAmount: selected.length * (show?.price || 250)
      });
      
      alert("🎉 Booking Successful! Check your email for confirmation.");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-red-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading seats...</p>
        </div>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Show</h2>
          <p className="text-gray-600 mb-6">{error || "Show not found"}</p>
          <button 
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const pricePerSeat = show.price || 250;
  const totalAmount = selected.length * pricePerSeat;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Show Times</span>
        </button>

        {/* Show Information Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {show.movie?.title || "Select Your Seats"}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <span className="font-medium">{show.theatre || "PVR Cinemas"}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-red-600" />
                  <span>{new Date(show.timing).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <span className="font-semibold">{new Date(show.timing).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</span>
                </div>
              </div>
            </div>

            {show.format && (
              <div className="inline-block px-6 py-3 bg-purple-100 text-purple-700 rounded-full font-bold text-lg">
                {show.format}
              </div>
            )}
          </div>
        </div>

        {/* Seat Grid */}
        <SeatGrid 
          seats={show.seats || []} 
          toggle={toggleSeat}
          selectedSeats={selected}
        />

        {/* Booking Summary */}
        {selected.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 shadow-xl border-2 border-red-200 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Left: Selected Seats Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <Ticket className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Selected Seats
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {selected.map(seat => (
                    <span 
                      key={seat}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-sm shadow-md"
                    >
                      {seat}
                    </span>
                  ))}
                </div>

                <div className="text-sm text-gray-600">
                  {selected.length} {selected.length === 1 ? 'ticket' : 'tickets'} × ₹{pricePerSeat} each
                </div>
              </div>

              {/* Right: Price and Button */}
              <div className="md:text-right">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                  <div className="text-4xl font-bold text-red-600">₹{totalAmount}</div>
                </div>

                <button
                  onClick={book}
                  disabled={booking}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
                >
                  {booking ? (
                    <>
                      <Loader className="w-6 h-6 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6" />
                      <span>Proceed to Payment</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="mt-6 pt-6 border-t border-red-200">
              <p className="text-xs text-gray-600 text-center">
                By clicking "Proceed to Payment", you agree to our booking terms and conditions. 
                Tickets are non-refundable and non-transferable.
              </p>
            </div>
          </div>
        )}

        {/* No Seats Selected Message */}
        {selected.length === 0 && (
          <div className="mt-8 bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
            <p className="text-blue-800 font-medium">
              👆 Please select your seats from the grid above to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}