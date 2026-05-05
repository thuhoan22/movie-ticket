"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { lockSeat } from "@/lib/lockSeat.api";

type SeatMapProps = {
  showtimeId: string;
  userId?: string;
  onSelect: (seatIds: number[]) => void;
};

export default function SeatMap({ showtimeId, userId, onSelect }: SeatMapProps) {
  const [seats, setSeats] = useState<any[]>([]);
  const [lockedSeats, setLockedSeats] = useState<any[]>([]);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    if (!showtimeId) return;

    const fetchSeats = async () => {
      const { data, error } = await supabase
        .from("seats")
        .select("*")
        .eq("showtime_id", Number(showtimeId));

      if (error) {
        console.error(error);
        return;
      }

      console.log("FETCHED SEATS:", data?.length);

      setSeats(data || []);
    };

    fetchSeats();
  }, [showtimeId]);

  const isLocked = (id: number) =>
    lockedSeats.some((l) => l.seat_id === id);

  const toggleSeat = async (seat: any) => {
    if (isLocked(seat.id)) return;

    if (selected.includes(seat.id)) {
      const updated = selected.filter((s) => s !== seat.id);
      setSelected(updated);
      onSelect(updated);
    } else {
      await lockSeat({
        seatId: seat.id,
        showtimeId,
        userId,
      });

      const updated = [...selected, seat.id];
      setSelected(updated);
      onSelect(updated);
    }
  };

  // 👉 group theo row
  const rows = Array.from(
    new Set(seats.map((s) => s.row))
  );

  const groupedSeats = seats.reduce((acc: any, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="seat-area">
      <div className="screen">SCREEN</div>

      {/* SEATS */}
      <div className="seat-map">
        {rows.map((row) => {
          // lọc + sort ghế theo number
          const rowSeats = seats
            .filter((s) => s.row === row)
            .sort((a, b) => a.number - b.number);

          return (
            <div key={row} className="seat-row">
              <span className="seat-row-label">{row}</span>

              <div className="seat-group">
                {rowSeats.map((seat) => {
                  const locked = isLocked(seat.id);
                  const isSelected = selected.includes(seat.id);

                  // lối đi sau ghế số 4 (chuẩn hơn index)
                  const isAisle = seat.number === 6;

                  return (
                    <div key={seat.id} className="seat-item-wrap">
                      {isAisle && <div className="aisle" />}

                      <button
                        disabled={locked}
                        onClick={() => toggleSeat(seat)}
                        className={`seat-item ${seat.type}${locked ? "locked" : ""}${isSelected ? "selected" : ""}`}
                      >
                        {seat.number}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* label bên phải giống CGV */}
              <span className="seat-row-label">{row}</span>
            </div>
          );
        })}
      </div>

      {/* LEGEND */}
      <ul className="legend-list">
        <li className="legend-item">
          <span className="seat-item standard"></span>
          <span className="text">Standard</span>
        </li>
        <li className="legend-item">
          <span className="seat-item vip"></span>
          <span className="text">VIP</span>
        </li>
        <li className="legend-item">
          <span className="seat-item couple"></span>
          <span className="text">Couple</span>
        </li>
        <li className="legend-item">
          <span className="seat-item selected"></span>
          <span className="text">Selected</span>
        </li>
        <li className="legend-item">
          <span className="seat-item locked"></span>
          <span className="text">Booked</span>
        </li>
      </ul>
    </div>
  );
}