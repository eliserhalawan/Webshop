export default function ProductModal({ product, onClose, onAddToCart }) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Left: image */}
        <div className="md:w-1/2 bg-gray-50 flex items-center justify-center p-6">
          <img
            src={`http://localhost:3000${product.image_path}`}
            alt={product.name}
            className="w-full h-72 md:h-96 object-contain rounded-xl"
          />
        </div>

        {/* Right: details */}
        <div className="md:w-1/2 p-8 flex flex-col overflow-y-auto">

          {/* Category badge */}
          {product.category && (
            <span className="self-start bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>
          )}

          {/* Name */}
          <h2 className="text-2xl font-bold text-gray-900 leading-snug mb-3">
            {product.name}
          </h2>

          {/* Price */}
          <p className="text-3xl font-bold text-gray-900 mb-1">
            €{Number(product.price).toFixed(2)}
          </p>

          {/* Divider */}
          <hr className="border-gray-100 mb-5" />

          {/* Description */}
          <div className="flex-1 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              {product.description || "No description provided."}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-auto">
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors duration-200"
            >
              Add to Cart
            </button>
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-colors duration-200"
            >
              Close
            </button>
          </div>

        </div>

        {/* Close button top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-900 w-9 h-9 rounded-full flex items-center justify-center shadow-sm border border-gray-200 transition-colors duration-200"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

      </div>
    </div>
  );
}