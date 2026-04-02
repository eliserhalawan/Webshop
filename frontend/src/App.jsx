import { use, useEffect, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductList from "./components/ProductList";
import AddProductModal from "./components/AddproductModal";
import ShoppingCart from "./components/ShoppingCart";
import LoginModal from "./components/LoginModal";

export default function App() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  // ── Auth ─────────────────────────────────────────
    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/api/profile", {
        headers: { Authorization: `Bearer ${token}` 
      },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) setCurrentUser(data.user.username);
          else localStorage.removeItem("token");
        });
    }
  }, []);

  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
  };

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
        currentUser={currentUser}
        onOpenLogin={() => setShowLogin(true)}
        onAddProduct={() => setShowForm(true)}
        onOpenCart={() => setShowCart(true)}
        onLogout={handleLogout}
      />

      <Hero />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

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
