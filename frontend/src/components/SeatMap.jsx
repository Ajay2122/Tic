export default function SeatMap({ seats, selectedSeats, onSeatToggle }) {
  const rows = [...new Set(seats.map((s) => s.row_letter))].sort();

  const seatClass = (seat) => {
    if (seat.is_booked)
      return 'bg-gray-100 text-gray-300 cursor-not-allowed border border-gray-200';
    if (selectedSeats.includes(seat.id))
      return 'bg-[#e50914] text-white border border-red-600 shadow-sm scale-105';
    return 'bg-white text-gray-600 border border-gray-300 hover:border-red-400 hover:text-red-600 hover:bg-red-50 cursor-pointer';
  };

  return (
    <div className="select-none">
      {/* Screen */}
      <div className="text-center mb-10">
        <div className="w-4/5 mx-auto">
          <div className="h-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"></div>
          <div className="mt-1 h-6 bg-gradient-to-b from-gray-100 to-transparent rounded-b-full flex items-end justify-center pb-0.5">
            <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">Screen</span>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2.5">
        {rows.map((row) => {
          const rowSeats = seats
            .filter((s) => s.row_letter === row)
            .sort((a, b) => a.seat_number - b.seat_number);
          return (
            <div key={row} className="flex items-center gap-3">
              <span className="w-5 text-center text-xs font-bold text-gray-400">{row}</span>
              <div className="flex gap-1.5 flex-1 justify-center flex-wrap">
                {rowSeats.map((seat) => (
                  <button
                    key={seat.id}
                    disabled={seat.is_booked}
                    onClick={() => !seat.is_booked && onSeatToggle(seat.id)}
                    className={`w-8 h-7 rounded-t-lg text-[11px] font-semibold transition-all duration-150 ${seatClass(seat)}`}
                    title={`Row ${seat.row_letter} Seat ${seat.seat_number}${seat.is_booked ? ' — Booked' : ''}`}
                  >
                    {seat.seat_number}
                  </button>
                ))}
              </div>
              <span className="w-5 text-center text-xs font-bold text-gray-400">{row}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-8 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-5 rounded-t-lg bg-white border border-gray-300" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-5 rounded-t-lg bg-[#e50914]" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-5 rounded-t-lg bg-gray-100 border border-gray-200" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}
