import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Database connection
let db;

(async () => {
  try {
    db = await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        user_id TEXT UNIQUE,
        password TEXT
      )
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
})();

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Qtax API server" });
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Signup route
app.post("/api/signup", async (req, res) => {
  console.log("Received signup request:", req.body);
  const { email, id, password } = req.body;

  if (!email || !id || !password) {
    console.log("Missing required fields:", { email, id, password });
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      "INSERT INTO users (email, user_id, password) VALUES (?, ?, ?)",
      [email, id, hashedPassword]
    );
    console.log("User created successfully:", result);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "SQLITE_CONSTRAINT") {
      console.log("Duplicate entry attempt:", { email, id });
      res.status(409).json({ message: "Email or user ID already exists" });
    } else {
      res
        .status(500)
        .json({ message: "Error creating user", error: error.message });
    }
  }
});

// Get users route
app.get("/api/users", async (req, res) => {
  try {
    const users = await db.all("SELECT email, user_id FROM users");
    console.log("Fetched users:", users.length);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Catch-all route for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
