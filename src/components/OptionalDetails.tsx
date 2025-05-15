// src/components/OptionalDetails.tsx
import React from 'react';
import { useOrder } from '../context/OrderContext';

export default function OptionalDetails() {
  const { state, dispatch } = useOrder();

  return (
    <div className="bg-white p-4 rounded shadow">
      <label className="block mb-2">
        Customer Name
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={state.customerName}
          onChange={(e) =>
            dispatch({ type: 'SET_CUSTOMER_NAME', payload: e.target.value })
          }
        />
      </label>
      <label className="block mb-2">
        Customer Phone
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={state.customerPhone}
          onChange={(e) =>
            dispatch({ type: 'SET_CUSTOMER_PHONE', payload: e.target.value })
          }
        />
      </label>
      <label className="block mb-2">
        Aggregator ID
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={state.aggregatorId}
          onChange={(e) =>
            dispatch({ type: 'SET_AGGREGATOR_ID', payload: e.target.value })
          }
        />
      </label>
      <label className="block mb-2">
        Notes
        <textarea
          className="w-full border p-2 rounded"
          value={state.notes}
          onChange={(e) =>
            dispatch({ type: 'SET_NOTES', payload: e.target.value })
          }
        />
      </label>
    </div>
  );
}
