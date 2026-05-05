"use client";

import { Suspense } from "react";
import TicketPage from "./TicketPage"

export default function Ticket() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading ticket...</div>}>
      <TicketPage/>
    </Suspense>
  )
}