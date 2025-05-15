// src/pages/index.tsx
import { OrderProvider } from "../context/OrderContext";
import StoreSelector from "../components/StoreSelector";
import ProductList from "../components/ProductList";
import OptionalDetails from "../components/OptionalDetails";
import OrderSummary from "../components/OrderSummary";
import PaymentSection from "../components/PaymentSection";

export default function Home() {
  return (
    <OrderProvider>
      <main className="min-h-screen bg-neutral p-6">
        <header className="mb-8">
          <h1 className="text-primary text-3xl font-bold">Kunafa Kingdom POS</h1>
        </header>

        {/* Store dropdown */}
        <section className="mb-6">
          <StoreSelector className="w-full p-2 border border-gray-300 rounded" />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Products column */}
          <section>
            <h2 className="text-primary text-2xl font-semibold mb-2">
              Products
            </h2>
            <div className="bg-white p-4 rounded-lg shadow max-h-[500px] overflow-y-auto">
              <ProductList />
            </div>
          </section>

          {/* Summary + Details + Payment */}
          <section className="flex flex-col space-y-6">
            <OrderSummary />

            <div>
              <h2 className="text-primary text-xl font-semibold mb-2">
                Optional Details
              </h2>
              <OptionalDetails />
            </div>

            <div>
              <h2 className="text-primary text-xl font-semibold mb-2">
                Payment
              </h2>
              <PaymentSection />
            </div>
          </section>
        </div>
      </main>
    </OrderProvider>
  );
}
