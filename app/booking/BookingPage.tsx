"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import SeatMap from "@/components/SeatMap";


export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const showtimeId = searchParams.get("showtimeId");
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [total, setTotal] = useState(0);

  if (!showtimeId) {
    return (
      <div className="p-10 text-white">
        <h1>Choose Seats</h1>
        <p>Please choose a showtime from movie detail page first.</p>
      </div>
    );
  }

  return (
    <main className="container seat-page">
      <div className="inner">
        <h1>Choose Seats</h1>

        <SeatMap
          showtimeId={showtimeId}
          onSelect={setSelectedSeats}
        />

        <div className="booking-sidebar">
          <h3>Selected Seats</h3>

          <p>
            {selectedSeats.length
              ? selectedSeats.join(", ")
              : "No seats selected"}
          </p>

          <h3>Total</h3>
          <p>{total.toLocaleString()} VND</p>
          <button
            disabled={selectedSeats.length === 0}
            onClick={() =>
              router.push(`/checkout?seats=${selectedSeats.join(",")}&showtime=${showtimeId}`)
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