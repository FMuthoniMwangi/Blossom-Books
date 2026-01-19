'use client';

import { useState } from 'react';

type StkInitResponse = {
  CheckoutRequestID?: string;
  CustomerMessage?: string;
  error?: string;
};

function normalizeMsisdn(input: string) {
  let s = input.trim();
  if (s.startsWith('+')) s = s.slice(1);
  if (s.startsWith('07')) return `254${s.slice(1)}`;
  if (s.startsWith('01')) return `254${s.slice(1)}`;
  if (s.startsWith('7')) return `254${s}`;
  if (s.startsWith('1')) return `254${s}`;
  if (s.startsWith('254')) return s;
  return s;
}

export default function PayWithMpesa({
  orderId,
  totalAmount = 0,
}: {
  orderId: string;
  totalAmount?: number;
}) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    const normalized = normalizeMsisdn(phone);

    if (!normalized.startsWith('254') || normalized.length !== 12) {
      setError('Enter a valid Safaricom number');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/payment/stk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalized,
          orderId,
          amount: totalAmount,
        }),
      });

      const data: StkInitResponse = await res.json();

      if (!res.ok) {
        setError(data.error || 'Payment failed');
        return;
      }

      setMsg(
        data.CustomerMessage ||
          'STK push sent. Check your phone to complete payment.'
      );
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm max-w-md">
      <h2 className="text-xl font-semibold mb-4">Pay with M-PESA</h2>

      <p className="mb-4 text-sm text-zinc-600">
        Total: <strong>KES {totalAmount.toLocaleString()}</strong>
      </p>

      <form onSubmit={handlePay} className="space-y-4">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="07XXXXXXXX"
          className="w-full rounded border px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-emerald-600 px-4 py-2 font-medium text-white"
        >
          {loading ? 'Sending STK…' : 'Pay Now'}
        </button>
      </form>

      {msg && <p className="mt-4 text-green-600">{msg}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
}
