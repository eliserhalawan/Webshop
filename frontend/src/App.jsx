import { useEffect, useState } from "react";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import ProductList from "./Components/Productlist";
import AddProductModal from "./Components/Addproductmodal";
import ShoppingCart from "./Components/ShoppingCart";

export default function App() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // ── Products ──────────────────────────────────────────
  const fetchProducts = async () => {
    const response = await fetch("http://localhost:3000/api/products");
    const data = await response.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchProducts();
    } catch (error) {
      alert("Something went wrong while deleting the product.");
    }
  };

  // ── Cart ──────────────────────────────────────────────
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // ── Render ────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Header
        cart={cart}
        onAddProduct={() => setShowForm(true)}
        onOpenCart={() => setShowCart(true)}
      />

      <Hero />

      {showForm && (
        <AddProductModal
          onClose={() => setShowForm(false)}
          onProductAdded={fetchProducts}
        />
      )}

      <ProductList
        products={products}
        onAddToCart={addToCart}
        onDelete={handleDelete}
      />

      {showCart && (
        <ShoppingCart
          cart={cart}
          cartTotal={cartTotal}
          onRemove={removeFromCart}
          onClose={() => setShowCart(false)}
        />
      )}
    </div>
  );
}
