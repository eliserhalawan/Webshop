const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();

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
    )
`);

console.log("Database ready");

//Middleware
app.use(cors());
app.use(express.json());

// Set up multer for file uploads
app.use("/uploads", express.static("uploads"));

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

// Routes
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

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
