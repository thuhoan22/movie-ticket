"use client";

import { useSearchParams } from "next/navigation";
// import QRCode from "react-qr-code";

export default function TicketPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";

  return (
    <div className="p-10 text-white text-center">
      <h1>Your Ticket</h1>

      {/* <QRCode value={`order-${orderId}`} /> */}

      <p>Order ID: {orderId}</p>
    </div>
  );
}