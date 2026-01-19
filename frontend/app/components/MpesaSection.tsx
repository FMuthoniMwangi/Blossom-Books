"use client";

import PayWithMpesa from "./PayWithMpesa";

export default function MpesaSection() {
  const orderId = "ORDER_123";     // replace with real order id
  const totalAmount = 2500;        // replace with cart total

  return (
    <div className="mt-10 max-w-md">
      <PayWithMpesa
        orderId={orderId}
        totalAmount={totalAmount}
      />
    </div>
  );
}
