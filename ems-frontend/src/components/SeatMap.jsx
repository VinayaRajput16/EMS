// src/components/SeatMap.jsx
import { useState, useEffect } from "react";
import { userApi } from "../api/user.api";

export default function SeatMap({ eventId, quantity, onSeatsSelected }) {
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAvailableSeats();
  }, [eventId]);

  useEffect(() => {
    // Notify parent component when seats are selected
    onSeatsSelected(selectedSeats);
  }, [selectedSeats, onSeatsSelected]);

  const loadAvailableSeats = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAvailableSeats(eventId);
      setAvailableSeats(res.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load seats");
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    if (selectedSeats.find(s => s.id === seat.id)) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      // Select seat (only if not exceeding quantity)
      if (selectedSeats.length < quantity) {
        setSelectedSeats([...selectedSeats, seat]);
      } else {
        alert(`You can only select ${quantity} seat(s)`);
      }
    }
  };

  const isSeatSelected = (seatId) => {
    return selectedSeats.some(s => s.id === seatId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
        {error}
      </div>
    );
  }

  if (availableSeats.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
        No seats available for this event.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selection Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 font-medium">
          Select {quantity} seat(s) • {selectedSeats.length} selected
        </p>
        {selectedSeats.length > 0 && (
          <p className="text-sm text-blue-700 mt-1">
            Selected: {selectedSeats.map(s => s.label).join(", ")}
          </p>
        )}
      </div>

      {/* Seat Map by Category */}
      {availableSeats.map((category) => (
        <div key={category.categoryId} className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {category.categoryName}
          </h3>

          {/* Seat Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {category.seats.map((seat) => {
              const isSelected = isSeatSelected(seat.id);
              
              return (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  className={`
                    relative p-3 rounded-lg text-sm font-medium transition-all duration-200
                    ${isSelected
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                    }
                  `}
                  title={seat.label}
                >
                  {seat.label}
                </button>
              );
            })}
          </div>

          {category.seats.length === 0 && (
            <p className="text-gray-500 text-sm">No available seats in this category</p>
          )}
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 border border-green-300 rounded-lg"></div>
          <span className="text-gray-700">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <span className="text-gray-700">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
          <span className="text-gray-700">Occupied</span>
        </div>
      </div>
    </div>
  );
}
