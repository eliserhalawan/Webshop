import { lazy, Suspense } from "react";

const ProductCard = lazy(() => import("./ProductCard"));

export default function ProductList({ products, onAddToCart, onDelete }) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">
            Our Collection
          </p>
          <h2 className="text-3xl font-bold text-gray-600">Products</h2>
        </div>
        <span className="text-sm text-gray-500">{products.length} items</span>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg font-medium">No products yet.</p>
          <p className="text-gray-500 text-sm mt-1">
            Add some products to your collection.
          </p>
        </div>
      ) : (
      <Suspense fallback={<div>Loading products...</div>}> 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onDelete={onDelete}
            />
          ))}
        </div>
      </Suspense>
      )}
    </main>
  );
}
