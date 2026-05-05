"use client";

import { Suspense } from "react";
import BookingPage from "./BookingPage";

export default function Booking() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading booking...</div>}>
      <BookingPage />
    </Suspense>
  );
}