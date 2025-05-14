// src/components/InvoiceModal.tsx

import React from 'react';
import { OrderItem, AppliedCharge } from '../context/OrderContext';

type Props = {
  visible: boolean;
  onClose: () => void;
  storeName: string;
  items: OrderItem[];
  charges: AppliedCharge[];
  total: number;
};

export default function InvoiceModal({ visible, onClose, storeName, items, charges, total }: Props) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[400px] p-6 rounded shadow">
        <h2 className="text-xl font-bold text-center mb-4">Invoice</h2>
        <div className="mb-2 text-sm">Store: {storeName}</div>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>{item.productName} ({item.variantName}) × {item.quantity}</span>
            <span>₹{item.unitPrice * item.quantity}</span>
          </div>
        ))}
        {charges.map((charge, idx) => (
          <div key={idx} className="flex justify-between text-sm text-gray-600">
            <span>{charge.name}</span>
            <span>₹{charge.amount}</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <button
          className="mt-4 w-full bg-green-600 text-white py-2 rounded"
          onClick={() => {
            window.print();
            onClose();
          }}
        >
          Print
        </button>
      </div>
    </div>
  );
}
