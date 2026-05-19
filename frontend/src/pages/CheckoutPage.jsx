import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage ({ cart, cartTotal, onOrderSuccess }) {
  const navigate = useNavigate();

  return (
      <div className="bg-white border-b border-gray-200">
        {/* Header */} 
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">

          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              W
            </div>
            <span className="text-xl font-bold text-gray-900">Webshop</span>
          </div>

          {/* Breadcrumb */}
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">Checkout</span>
        </div>
        {/* Page content */}
        <div className="max-w-5xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

          {/* Two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left column - delivery form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Delivery Information
              </h2>
              <div className="space-y-4">

                {/* Full name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    
                    placeholder="Jan de Vries"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Dorpsstraat 12"
                    
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                {/* City and postal code */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="Amsterdam"
                      
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="1011 AB"
                     
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>
              </div>
               
                  </div>
                </div>
              </div>
            </div>

  );
}