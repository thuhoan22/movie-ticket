"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ConfirmModal from "@/components/ConfirmModal";
import { useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);

  return (
    <div className="p-10 text-white">
      <h1>Ticket Info</h1>

      <p>Seats: {params.get("seats")}</p>

      <button onClick={() => setOpen(true)} className="btn-primary">
        Book Ticket
      </button>

      {open && (
        <ConfirmModal
          onConfirm={() => router.push("/payment")}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}