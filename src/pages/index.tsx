// src/pages/index.tsx

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import ProductList from '../components/ProductList';
import ChargeList from '../components/ChargeList';
import OrderSummary from '../components/OrderSummary';
import PaymentSection from '../components/PaymentSection';
import InvoiceModal from '../components/InvoiceModal';
import { OrderProvider, useOrder } from '../context/OrderContext';

type Store = {
  id: string;
  name: string;
};

function OrderPage() {
  const { state, dispatch } = useOrder();
  const [stores, setStores] = useState<Store[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = state.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const taxableCharges = state.charges.filter(c => c.isTaxable).reduce((sum, c) => sum + c.amount, 0);
  const nonTaxableCharges = state.charges.filter(c => !c.isTaxable).reduce((sum, c) => sum + c.amount, 0);
  const taxableAmount = subtotal - state.discount + taxableCharges;
  const cgst = +(taxableAmount * 0.09).toFixed(2);
  const sgst = +(taxableAmount * 0.09).toFixed(2);
  const total = +(taxableAmount + cgst + sgst + nonTaxableCharges).toFixed(2);

  useEffect(() => {
    fetch('/api/stores')
      .then(res => res.json())
      .then(setStores)
      .catch(console.error);
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: state.storeId,
          items: state.items.map(i => ({
            variantId: i.variantId,
            quantity: i.quantity,
            unit_price: i.unitPrice,
          })),
          applied_charges: state.charges.map(c => ({
            chargeId: c.chargeId,
            amount_charged: c.amount,
          })),
          discount_amount: state.discount,
          payment_method: state.paymentMethod,
          amount_received: state.amountReceived,
          customer_name: state.customerName,
          customer_phone: state.customerPhone,
          aggregator_id: state.aggregatorId,
          notes: state.notes,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Order failed');
      setSubmitted(true);
      dispatch({ type: 'RESET_ORDER' });
    } catch (err) {
      if (err instanceof Error) {
        alert('Error: ' + err.message);
      } else {
        alert('Unknown error occurred');
      }
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Head>
        <title>Kunafa Kingdom Order Entry</title>
      </Head>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Kunafa Kingdom – Order Entry</h1>

        <label className="block mb-2">Select Store:</label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={state.storeId || ''}
          onChange={(e) => dispatch({ type: 'SET_STORE', payload: e.target.value })}
        >
          <option value="" disabled>Select a store...</option>
          {stores.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {state.storeId && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ProductList />
                <ChargeList />
              </div>
              <div>
                <OrderSummary />
                <div className="mt-4">
                  <label className="block mb-1 text-sm">Discount (₹):</label>
                  <input
                    type="number"
                    min="0"
                    className="border p-2 w-full rounded"
                    value={state.discount}
                    onChange={(e) =>
                      dispatch({ type: 'UPDATE_DISCOUNT', payload: parseFloat(e.target.value || '0') })
                    }
                  />
                </div>
                <PaymentSection />
                <div className="mt-4">
                  <label className="block text-sm mb-1">Customer Name</label>
                  <input
                    className="border p-2 w-full rounded"
                    value={state.customerName}
                    onChange={(e) =>
                      dispatch({ type: 'SET_CUSTOMER_NAME', payload: e.target.value })
                    }
                  />
                  <label className="block text-sm mt-2 mb-1">Customer Phone</label>
                  <input
                    className="border p-2 w-full rounded"
                    value={state.customerPhone}
                    onChange={(e) =>
                      dispatch({ type: 'SET_CUSTOMER_PHONE', payload: e.target.value })
                    }
                  />
                  <label className="block text-sm mt-2 mb-1">Aggregator ID (Swiggy/Zomato)</label>
                  <input
                    className="border p-2 w-full rounded"
                    value={state.aggregatorId}
                    onChange={(e) =>
                      dispatch({ type: 'SET_AGGREGATOR_ID', payload: e.target.value })
                    }
                  />
                </div>
                <button
                  className="mt-6 w-full bg-blue-600 text-white py-2 rounded font-semibold disabled:opacity-50"
                  disabled={isSubmitting || !state.items.length || !state.paymentMethod}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <InvoiceModal
        visible={submitted}
        onClose={() => setSubmitted(false)}
        storeName={stores.find(s => s.id === state.storeId)?.name || ''}
        items={state.items}
        charges={state.charges}
        total={total}
      />
    </div>
  );
}

export default function WrappedOrderPage() {
  return (
    <OrderProvider>
      <OrderPage />
    </OrderProvider>
  );
}
