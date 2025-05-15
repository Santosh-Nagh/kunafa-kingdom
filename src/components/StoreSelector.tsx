// src/components/StoreSelector.tsx
import React, { useEffect, useState } from 'react';
import { useOrder } from '../context/OrderContext';

type Store = {
  id: string;
  name: string;
  address: string;
};

export default function StoreSelector({
  className,
}: {
  className?: string;
}) {
  const [stores, setStores] = useState<Store[]>([]);
  const { state, dispatch } = useOrder();

  useEffect(() => {
    fetch('/api/stores')
      .then((res) => res.json())
      .then(setStores)
      .catch(console.error);
  }, []);

  return (
    <select
      className={className}
      value={state.storeId ?? ''}
      onChange={(e) => dispatch({ type: 'SET_STORE', payload: e.target.value })}
    >
      <option value="">Select store</option>
      {stores.map((s) => (
        <option key={s.id} value={s.id}>
          {s.name}
        </option>
      ))}
    </select>
  );
}
