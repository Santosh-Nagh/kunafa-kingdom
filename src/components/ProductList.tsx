// src/components/ProductList.tsx

import React, { useEffect, useState } from 'react';
import { useOrder } from '../context/OrderContext';

type Variant = {
  id: string;
  name: string;
  price: number;
  inventoryTrackingMethod: string;
};

type Product = {
  id: string;
  name: string;
  category: { name: string };
  variants: Variant[];
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const { dispatch } = useOrder();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  return (
    <div className="mb-6">
      {products.map((product) => (
        <div key={product.id} className="mb-4 border rounded-lg p-4 shadow">
          <h3 className="font-bold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.category.name}</p>
          <div className="flex flex-wrap gap-3 mt-2">
            {product.variants.map((variant) => (
              <div key={variant.id} className="flex items-center gap-2 border px-2 py-1 rounded">
                <div className="text-sm">{variant.name} - ₹{variant.price}</div>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() =>
                    dispatch({
                      type: 'ADD_ITEM',
                      payload: {
                        variantId: variant.id,
                        productId: product.id,
                        productName: product.name,
                        variantName: variant.name,
                        quantity: 1,
                        unitPrice: variant.price,
                      },
                    })
                  }
                >
                  + Add
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
