"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import SeatMap from "@/components/SeatMap";
import type { SelectedSeat } from "@/components/SeatMap";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showtimeId = searchParams.get("showtimeId");
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  const total = useMemo(() => {
    const priceByType: Record<string, number> = {
      standard: 90000,
      vip: 120000,
      couple: 180000,
    };
    return selectedSeats.reduce((sum, seat) => {
      const key = (seat.type || "standard").toLowerCase();
      return sum + (priceByType[key] ?? priceByType.standard);
    }, 0);
  }, [selectedSeats]);

  if (!showtimeId) {
    return (
      <div className="p-10 text-white">
        <h1>Choose Seats</h1>
        <p>Please choose a showtime from movie detail page first.</p>
      </div>
    );
  }

  const handleSelectSeats = (seats: SelectedSeat[]) => {
    // RULE 1: max 8 ghế
    if (seats.length > 8) {
      toast.error("You can only select up to 8 seats");
      return;
    }

    // RULE 2: ghế couple phải đi theo cặp
    const coupleSeats = seats.filter((s) => s.type === "couple");

    if (coupleSeats.length % 2 !== 0) {
      toast.error("Couple seats must be selected in pairs");
      return;
    }

    // RULE 3: không để ghế trống giữa (simple version)
    const sorted = [...seats].sort((a, b) => a.col - b.col);

    for (let i = 0; i < sorted.length - 1; i++) {
      const gap = sorted[i + 1].col - sorted[i].col;

      if (gap > 2) {
        toast.error("You cannot leave a single empty seat between selections");
        return;
      }
    }

    setSelectedSeats(seats);
  };

  return (
    <main className="container seat-page">
      <div className="inner">
        <h1>Choose Seats</h1>

        <SeatMap
          showtimeId={showtimeId}
          onSelect={handleSelectSeats}
        />

        <div className="seat-info-booking">
          <h3>Selected Seats</h3>

          <p>
            {selectedSeats.length
              ? selectedSeats.map((s) => s.label).join(", ")
              : "No seats selected"}
          </p>

          <h3>Total</h3>
          <p>{total.toLocaleString()} VND</p>
          <button
            disabled={selectedSeats.length === 0}
            onClick={() =>
              router.push(
                `/checkout?seats=${selectedSeats.map((s) => s.id).join(",")}&showtime=${showtimeId}`,
              )
            }
            className="btn-checkout"
          >
            Continue
          </button>
        </div>

      </div>
    </main>
  );
}