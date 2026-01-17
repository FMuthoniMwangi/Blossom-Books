'use client';

import { useState } from 'react';

type StkInitResponse = {
  ok?: boolean;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  CustomerMessage?: string;
  error?: string;
};

// Normalize Kenyan phone numbers
function normalizeMsisdn(input: string) {
let s = (input || '').trim();

  // Remove leading +
  if (s.startsWith('+')) s = s.slice(1);

  // 07XXXXXXXX => 2547XXXXXXXX
  if (s.startsWith('07')) return `254${s.slice(1)}`;

  // 01XXXXXXXX => 2541XXXXXXXX
  if (s.startsWith('01')) return `254${s.slice(1)}`;

  // 7XXXXXXXX => 2547XXXXXXXX
  if (s.startsWith('7')) return `254${s}`;

  // 1XXXXXXXX => 2541XXXXXXXX
  if (s.startsWith('1')) return `254${s}`;

  // Already in 254XXXXXXXXX format
  if (s.startsWith('254')) return s;

  // Otherwise return as-is
  return s;}

export default function PayWithMpesa() {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);
    setCheckoutId(null);

    const normalized = normalizeMsisdn(phone);

    // Validate phone
    if (!normalized.startsWith('254') || normalized.length !== 12) {
      setError('Enter a valid Safaricom number like 254XXXXXXXXX');
      return;
    }

    // Validate amount
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError('Enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/payment/stk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: normalized, amount: amt }),
      });

      const data: StkInitResponse = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to initiate STK push');
        return;
      }

      setCheckoutId(data.CheckoutRequestID || null);
      setMsg(
        data.CustomerMessage ||
          'STK push sent. Check your phone and enter your M-PESA PIN.'
      );

      // Update input to normalized format
      setPhone(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm max-w-md">
      <h2 className="text-xl font-semibold mb-4">Pay with M‑PESA</h2>

      <form onSubmit={handlePay} className="space-y-4">
        <div>
          <label className="block text-sm text-zinc-600 mb-1">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07XXXXXXXX or 2547XXXXXXXX"
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-600 mb-1">Amount (KES)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setAmount(isNaN(val) ? '' : val);
            }}
            min={1}
            className="w-full rounded border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Pay with M‑PESA'}
        </button>
      </form>

      {msg && <p className="mt-4 text-green-600">{msg}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {checkoutId && (
        <p className="mt-2 text-sm text-zinc-500">
          CheckoutRequestID: <span className="font-mono">{checkoutId}</span>
        </p>
      )}
    </div>
  );
}
