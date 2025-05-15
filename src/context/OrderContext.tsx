// src/context/OrderContext.tsx

import React, { createContext, useContext, useReducer } from 'react';

export type OrderItem = {
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
};

export type ChargeItem = {
  chargeId: string;
  name: string;
  amount: number;
  isTaxable: boolean;
};

export type AppliedCharge = ChargeItem & {
  amount: number;
};

type OrderState = {
  storeId: string | null;
  items: OrderItem[];
  charges: AppliedCharge[];
  discount: number;
  paymentMethod: string | null;
  amountReceived: number | null;
  customerName: string;
  customerPhone: string;
  aggregatorId: string;
  notes: string;
};

type OrderAction =
  | { type: 'SET_STORE'; payload: string }
  | { type: 'ADD_ITEM'; payload: OrderItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'INCREMENT_ITEM'; payload: string }
  | { type: 'DECREMENT_ITEM'; payload: string }
  | { type: 'ADD_CHARGE'; payload: AppliedCharge }
  | { type: 'REMOVE_CHARGE'; payload: string }
  | { type: 'UPDATE_DISCOUNT'; payload: number }
  | { type: 'SET_PAYMENT_METHOD'; payload: string }
  | { type: 'SET_AMOUNT_RECEIVED'; payload: number }
  | { type: 'SET_CUSTOMER_NAME'; payload: string }
  | { type: 'SET_CUSTOMER_PHONE'; payload: string }
  | { type: 'SET_AGGREGATOR_ID'; payload: string }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'RESET_ORDER' };

const initialState: OrderState = {
  storeId: null,
  items: [],
  charges: [],
  discount: 0,
  paymentMethod: null,
  amountReceived: null,
  customerName: '',
  customerPhone: '',
  aggregatorId: '',
  notes: '',
};

function reducer(state: OrderState, action: OrderAction): OrderState {
  switch (action.type) {
    case 'SET_STORE':
      return { ...initialState, storeId: action.payload };
    case 'ADD_ITEM': {
      const exists = state.items.find(item => item.variantId === action.payload.variantId);
      if (exists) {
        return {
          ...state,
          items: state.items.map(item =>
            item.variantId === action.payload.variantId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'INCREMENT_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.variantId === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    case 'DECREMENT_ITEM':
      return {
        ...state,
        items: state.items
          .map(item =>
            item.variantId === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter(item => item.quantity > 0),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.variantId !== action.payload),
      };
    case 'ADD_CHARGE':
      return {
        ...state,
        charges: [...state.charges, action.payload],
      };
    case 'REMOVE_CHARGE':
      return {
        ...state,
        charges: state.charges.filter(c => c.chargeId !== action.payload),
      };
    case 'UPDATE_DISCOUNT':
      return { ...state, discount: action.payload };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.payload };
    case 'SET_AMOUNT_RECEIVED':
      return { ...state, amountReceived: action.payload };
    case 'SET_CUSTOMER_NAME':
      return { ...state, customerName: action.payload };
    case 'SET_CUSTOMER_PHONE':
      return { ...state, customerPhone: action.payload };
    case 'SET_AGGREGATOR_ID':
      return { ...state, aggregatorId: action.payload };
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'RESET_ORDER':
      return { ...initialState, storeId: state.storeId };
    default:
      return state;
  }
}

const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
