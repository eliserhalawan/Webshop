import { useEffect } from "react";
import { useState } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchProducts = async () => {
    const response = await fetch("http://localhost:3000/api/products");
    const data = await response.json();
    console.log("Fetched products:", data);
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
 
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });
 
      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Something went wrong while deleting the product.");
    }
  };

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
        setName("");
        setPrice("");
        setDescription("");
        setCategory("");
        setImage(null);
        setPreview(null);
        setShowForm(false);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left: Logo and Nav */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  W
                </div>
                <span className="text-xl font-bold text-gray-800">Webshop</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="text-gray-600 hover:text-gray-900 font-medium hidden md:block"
              >
                Add Product
              </button>
              <button className="relative">
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
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Your marketplace for your <br></br>
            <span className="text-blue-600">all-day products</span>.
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Discover amazing products curated just for you.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <h2 className="text-2xl font-semibold mb-4">Add A New Product</h2>
            <div className="space-y-4">
              {/* Image uploads */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImage(file);
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                  className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0,00"
                  required
                  className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  rows="4"
                  className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter product category"
                  className="w-full border-2 border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-6 py-3 mt-4 rounded-lg font-semibold hover:bg-blue-700 transition w-full"
            >
              Add Product
            </button>
            <button
              onClick={() => setShowForm(false)}
              className=" absolute top-3 right-3 bg-red-500 text-white px-4 py-2 w-8 h-8 rounded-full hover:bg-red-700 items-center justify-center flex transition "
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Product List */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/*section header*/}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-blue-500 uppercase mb-1">
              Our Collection
            </p>
            <h2 className="text-3xl font-bold text-gray-600">Products</h2>
          </div>
          <span className="text-sm text-gray-500">{products.length} items</span>
        </div>

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
            <p className="text-gray-500 text-lg font-medium">
              No products yet.
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Add some products to your collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Product Image */}
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
                  {/* Quick-add overlay */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <button className="bg-white text-gray-900 text-sm font-semibold px-5 py-2 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 translate-y-3 group-hover:translate-y-0">
                      Add to cart
                    </button>
                    <button
                      onClick={(e) => { handleDelete(product.id); }}
                      className="absolute top-3 right-3 bg-white text-red-500 text-sm font-semibold px-3 py-2 rounded-full shadow-lg hover:bg-red-500 hover:text-white transition-colors duration-200 translate-y-3 group-hover:translate-y-0"
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
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
