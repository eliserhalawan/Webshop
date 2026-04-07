import { useEffect, useState } from "react";
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
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.user) {
            setCurrentUser(data.user.username);
            fetchCart();
          } else {
            localStorage.removeItem("token");
          }
        });
    }
  }, []);

  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
    fetchCart();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setCart([]);
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
  // load cart form database
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch("http://localhost:3000/api/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setCart(data);
  };

  //add a product to the cart 
  const addToCart = async (productOrId) => {
    const productId = typeof productOrId === "object" ? productOrId?.id : productOrId;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const response = await fetch(`http://localhost:3000/api/cart/${productId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      fetchCart();
    } else {
      const data = await response.json();
      alert(data.error || "Failed to add product to cart.");
    }
  };

    // remove a product from the cart
    const removeFromCart = async (Id) => {
      const token = localStorage.getItem("token");
      
      await fetch(`http://localhost:3000/api/cart/${Id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

    fetchCart();
  };

  const cartTotal = cart.reduce((total, item) => total + item.price, 0);


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
