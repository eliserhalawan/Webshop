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

// ── Start server ───────────────────────────
// ───────────────────────────────────

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
