import { useState } from "react";

export default function AddProductModal({ onClose, onProductAdded }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !image) {
      alert("Please fill in all required fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);

    try {
      const response = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        onProductAdded(); // tell App.jsx to refresh the product list
        onClose();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 md:pb-5">
            <h3 className="text-lg font-medium text-gray-900">
              Create new product
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-9 h-9 inline-flex justify-center items-center transition"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Body */}
          <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
            {/* Image upload */}
            <div className="col-span-2">
              <label className="block mb-2.5 text-sm font-medium text-gray-900">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  if (file) setPreview(URL.createObjectURL(file));
                }}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-xs"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-3 w-full h-32 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Name */}
            <div className="col-span-2">
              <label className="block mb-2.5 text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type product name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 shadow-xs"
                required
              />
            </div>

            {/* Price */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block mb-2.5 text-sm font-medium text-gray-900">
                Price (€)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 shadow-xs"
                required
              />
            </div>

            {/* Category */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block mb-2.5 text-sm font-medium text-gray-900">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 shadow-xs"
              >
                <option value="">Select category</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block mb-2.5 text-sm font-medium text-gray-900">
                Product Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                placeholder="Write product description here"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 shadow-xs"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-gray-200 pt-4 md:pt-6">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 transition focus:outline-none"
            >
              <svg
                className="w-4 h-4 me-1.5 -ms-0.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14m-7 7V5"
                />
              </svg>
              Add new product
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 bg-gray-100 border border-gray-300 hover:bg-gray-200 hover:text-gray-900 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 transition focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}