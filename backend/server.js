require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const JWT_SECRET = process.env.JWT_SECRET;

// ── Database ──────────────────────────────────
// ────────────────────────────────

const db = new Database("webshop.db");

// Products table and Users table
db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        category TEXT,
        image_path TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Cart items table
db.exec(`
  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )
`);

// Orders and order items tables
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    full_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )
`);

console.log("Database ready");

// ── Middleware ─────────────────────────────
// ───────────────────────────────────

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ── Multer (image uploads) ─────────────────
// ─────────────────────────

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the current timestamp and original name
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

// Configure multer with storage, file size limit, and file type filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// ── Auth middleware ──────────────────────────
// ─────────────────────────────────

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token!" });
  }
};

// ── Auth routes ──────────────────────────────
// ────────────────────────────────

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  }

  const existingUser = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = db
    .prepare("INSERT INTO users (username, password) VALUES (?, ?)")
    .run(username, hashedPassword);

  res.json({
    message: "Account created successfully!",
    userId: result.lastInsertRowid,
  });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password!" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid username or password!" });
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "24h" },
  );

  res.json({
    message: "Login successful!",
    token,
    username: user.username,
  });
});

app.get("/api/profile", verifyToken, (req, res) => {
  res.json({
    message: "This is protected data!",
    user: req.user,
  });
});

// ── Product routes ──────────────────────────────────
// ──────────────────────────

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

// Route to handle product creation with image upload
app.post("/api/products", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { name, price, description, category } = req.body;

  if (!name || !price) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  const imagePath = `/uploads/${req.file.filename}`;

  try {
    const insert = db.prepare(
      `INSERT INTO products (name, price, description, category, image_path)
             VALUES (?, ?, ?, ?, ?)`,
    );

    const result = insert.run(name, price, description, category, imagePath);

    res.status(201).json({
      message: "Product created successfully",
      product: {
        id: result.lastInsertRowid,
        name,
        price,
        description,
        category,
        image_path: imagePath,
      },
    });
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Route to fetch all products
app.get("/api/products", (req, res) => {
  try {
    const products = db
      .prepare("SELECT * FROM products ORDER BY created_at DESC")
      .all();
    res.json(products);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Route to delete a product by ID
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  try {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    db.prepare("DELETE FROM products WHERE id = ?").run(id);

    const fs = require("fs");
    const imagePath = "./uploads/" + product.image_path.split("/").pop();
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// ── Cart routes ────────────────────────────
// ───────────────────────────────────

// fetch cart items for the logged-in user
app.get("/api/cart", verifyToken, (req, res) => {
  try {
    const items = db
      .prepare(
        `
      SELECT cart_items.id, products.*
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = ?
      ORDER BY cart_items.added_at DESC
    `,
      )
      .all(req.user.userId);

    res.json(items);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// add a product to the cart
app.post("/api/cart/:productId", verifyToken, (req, res) => {
  const { productId } = req.params;

  try {
    // Check if the product exists
    const product = db
      .prepare("SELECT * FROM products WHERE id = ?")
      .get(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the product is already in the user's cart
    const existing = db
      .prepare("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?")
      .get(req.user.userId, productId);
    if (existing) {
      return res.status(400).json({ error: "Product already in cart" });
    }

    db.prepare(
      "INSERT INTO cart_items (user_id, product_id) VALUES (?, ?)",
    ).run(req.user.userId, productId);

    res.status(201).json({ message: "Product added to cart" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
});

app.delete("/api/cart/:productId", verifyToken, (req, res) => {
  const { productId } = req.params;

  try {
    db.prepare(
      "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
    ).run(req.user.userId, productId);

    res.json({ message: "Product removed from cart" });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
});

// ── Order routes ───────────────────────────
// ───────────────────────────────────

// Place an order
app.post("/api/orders", verifyToken, (req, res) => {
  const { full_name, address, city, postal_code } = req.body;

  if (!full_name || !address || !city || !postal_code) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const cartItems = db.prepare(`
      SELECT cart_items.product_id, products.price
      FROM cart_items
      JOIN products ON cart_items.product_id = products.id
      WHERE cart_items.user_id = ?
    `).all(req.user.userId);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    const order = db.prepare(`
      INSERT INTO orders (user_id, total, full_name, address, city, postal_code)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.user.userId, total, full_name, address, city, postal_code);

    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, product_id, price)
      VALUES (?, ?, ?)
    `);
    for (const item of cartItems) {
      insertItem.run(order.lastInsertRowid, item.product_id, item.price);
    }

    // Clear the user's cart after placing the order
    db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(req.user.userId);

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order.lastInsertRowid,
      total,
    });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

// Fetch orders for the logged-in user
app.get("/api/orders", verifyToken, (req, res) => {
  try {
    const orders = db
      .prepare(`
        SELECT * FROM orders 
        WHERE user_id = ? 
        ORDER BY created_at DESC`)
      .all(req.user.userId);

    res.json(orders);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ── Start server ───────────────────────────
// ───────────────────────────────────

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
