// src/components/PaymentSection.tsx

import React from 'react';
import { useOrder } from '../context/OrderContext';

const methods = ['Cash', 'Card', 'UPI', 'Swiggy', 'Zomato', 'Other'];

export default function PaymentSection() {
  const { state, dispatch } = useOrder();

  const handleAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value || '0');
    dispatch({ type: 'SET_AMOUNT_RECEIVED', payload: value });
  };

  return (
    <div className="mt-6 border p-4 rounded bg-white">
      <h3 className="font-semibold mb-2">Payment Method</h3>
      <div className="flex gap-2 mb-3">
        {methods.map(method => (
          <button
            key={method}
            onClick={() => dispatch({ type: 'SET_PAYMENT_METHOD', payload: method })}
            className={`px-3 py-1 rounded ${
              state.paymentMethod === method
                ? 'bg-green-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            {method}
          </button>
        ))}
      </div>
      {state.paymentMethod === 'Cash' && (
        <div>
          <label className="block text-sm mb-1">Amount Received</label>
          <input
            type="number"
            min="0"
            step="1"
            onChange={handleAmount}
            className="border p-2 rounded w-full"
          />
        </div>
      )}
    </div>
  );
}
