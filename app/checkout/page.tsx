"use client";

import { Suspense } from "react";
import CheckoutPage from "./CheckoutPage"

export default function Checkout() {
  return (
    <Suspense fallback={<div className="p-10 text-white">Loading checkout...</div>}>
      <CheckoutPage />
    </Suspense>
  )
}
