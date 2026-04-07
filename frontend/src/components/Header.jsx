export default function Header({ cart, currentUser, onAddProduct, onOpenCart, onOpenLogin, onLogout }) {
  const totalItems = cart.length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              W
            </div>
            <span className="text-xl font-bold text-gray-800">Webshop</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">

            {currentUser ? (
              // Logged in
              <>
                <span className="text-gray-600 text-sm hidden md:block">
                  Hey, <span className="font-semibold text-blue-600">{currentUser}</span>!
                </span>
                <button
                  onClick={onAddProduct}
                  className="text-gray-600 hover:text-gray-900 font-medium hidden md:block"
                >
                  Add Product
                </button>
                <button
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-500 font-medium text-sm hidden md:block"
                >
                  Log out
                </button>
              </>
            ) : (
              // Logged out
              <button
                onClick={onOpenLogin}
                className="text-gray-600 hover:text-gray-900 font-medium hidden md:block"
              >
                Log in
              </button>
            )}

            {/* Cart icon */}
            <button onClick={onOpenCart} className="relative">
              <svg
                className="w-6 h-6 text-gray-600 hover:text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 
