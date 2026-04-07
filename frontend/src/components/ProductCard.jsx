export default function ProductCard({ product, onAddToCart, onDelete }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 aspect-square">
        <img
          src={`http://localhost:3000${product.image_path}`}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {product.category}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <button
            onClick={() => onAddToCart(product)}
            className="bg-white text-gray-900 text-sm font-semibold px-5 py-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 translate-y-3 group-hover:translate-y-0"
          >
            Add to cart
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="absolute top-3 right-3 bg-white text-red-500 text-sm px-3 py-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors duration-200"
            aria-label="Delete product"
          >
            🗑
          </button>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-gray-900 font-semibold text-base leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-400 text-xs line-clamp-2 mb-3">
            {product.description}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-blue-600 font-bold text-lg">
            €{Number(product.price).toFixed(2)}
          </span>
          <button
            onClick={() => onAddToCart(product.id)}
            className="w-8 h-8 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-full flex items-center justify-center transition-colors duration-200"
            aria-label="Add to cart"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
