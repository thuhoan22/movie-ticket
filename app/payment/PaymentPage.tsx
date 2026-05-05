"use client";

import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  const handlePay = () => {
    // call API create order + booking_seats

    router.push("/ticket?orderId=123");
  };

  return (
    <div className="p-10 text-white">
      <h1>Payment</h1>

      <button onClick={handlePay} className="btn-primary">
        Pay Now
      </button>
    </div>
  );
}