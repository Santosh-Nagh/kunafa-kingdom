// src/components/ChargeList.tsx

import React, { useEffect, useState } from 'react';
import { useOrder } from '../context/OrderContext';

type Charge = {
  id: string;
  name: string;
  amount: number;
  is_taxable: boolean;
};

export default function ChargeList() {
  const [charges, setCharges] = useState<Charge[]>([]);
  const { state, dispatch } = useOrder();

  useEffect(() => {
    fetch('/api/charges')
      .then(res => res.json())
      .then(setCharges)
      .catch(console.error);
  }, []);

  const toggleCharge = (charge: Charge) => {
    const isSelected = state.charges.find(c => c.chargeId === charge.id);
    if (isSelected) {
      dispatch({ type: 'REMOVE_CHARGE', payload: charge.id });
    } else {
      dispatch({
        type: 'ADD_CHARGE',
        payload: {
          chargeId: charge.id,
          name: charge.name,
          amount: charge.amount,
          isTaxable: charge.is_taxable,
        },
      });
    }
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Additional Charges</h3>
      <div className="flex flex-col gap-2">
        {charges.map(charge => (
          <label key={charge.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!state.charges.find(c => c.chargeId === charge.id)}
              onChange={() => toggleCharge(charge)}
            />
            <span>{charge.name} — ₹{charge.amount}</span>
            <span className="text-xs text-gray-500">
              ({charge.is_taxable ? 'Taxable' : 'Non-taxable'})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
