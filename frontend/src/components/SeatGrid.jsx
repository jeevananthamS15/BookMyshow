// src/components/SeatGrid.jsx
import { Check, X } from "lucide-react";

export default function SeatGrid({ seats = [], toggle, selectedSeats = [] }) {
  if (!Array.isArray(seats) || seats.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl text-center text-gray-600">
        No seats available for this show
      </div>
    );
  }

  const getSeatStyle = (seat) => {
    if (seat.isBooked) {
      return "bg-gray-400 cursor-not-allowed text-gray-600";
    }
    if (selectedSeats.includes(seat.seatNo)) {
      return "bg-green-500 text-white scale-110 shadow-lg ring-2 ring-green-400";
    }
    return "bg-gray-200 hover:bg-green-400 hover:scale-110 text-gray-700 cursor-pointer";
  };

  /* Group seats by row letter (A, B, C...) */
  const groupedSeats = seats.reduce((acc, seat) => {
    if (!seat?.seatNo) return acc;

    const row = seat.seatNo.charAt(0);
    acc[row] = acc[row] || [];
    acc[row].push(seat);
    return acc;
  }, {});

  /* Sort rows alphabetically */
  const rows = Object.keys(groupedSeats).sort();

  /* Sort seats numerically inside each row */
  rows.forEach(row => {
    groupedSeats[row].sort((a, b) =>
      parseInt(a.seatNo.slice(1)) - parseInt(b.seatNo.slice(1))
    );
  });

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl">
      {/* Screen Indicator */}
      <div className="mb-10">
        <div className="relative">
          <div className="w-full h-3 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full mb-3 shadow-inner" />
          <div className="text-center">
            <span className="inline-block px-6 py-2 bg-gray-800 text-white text-sm font-semibold rounded-full shadow-lg">
              Screen This Way
            </span>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="space-y-3 mb-10">
        {rows.map(row => (
          <div key={row} className="flex items-center justify-center">
            {/* Row Label */}
            <div className="w-10 text-center font-bold text-gray-700 text-lg">
              {row}
            </div>

            {/* Seats */}
            <div className="flex space-x-2 flex-1 justify-center">
              {groupedSeats[row].map(seat => (
                <button
                  key={seat.seatNo}
                  disabled={seat.isBooked}
                  onClick={() => !seat.isBooked && toggle(seat.seatNo)}
                  className={`
                    w-10 h-10 rounded-t-xl transition-all duration-200
                    flex items-center justify-center text-xs font-bold
                    ${getSeatStyle(seat)}
                  `}
                  title={`Seat ${seat.seatNo} ${seat.isBooked ? "(Booked)" : ""}`}
                >
                  {seat.isBooked ? (
                    <X className="w-4 h-4" />
                  ) : selectedSeats.includes(seat.seatNo) ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    seat.seatNo.slice(1)
                  )}
                </button>
              ))}
            </div>

            {/* Row Label */}
            <div className="w-10 text-center font-bold text-gray-700 text-lg">
              {row}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center items-center space-x-8 pt-6 border-t border-gray-200">
        <Legend color="bg-gray-200" label="Available" />
        <Legend color="bg-green-500" label="Selected" />
        <Legend color="bg-gray-400" label="Booked" />
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-8 h-8 ${color} rounded-t-xl`} />
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
}
