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

async function initializeDatabase() {
  try {
    db = await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database,
    });

    // Check if the users table exists and has the correct structure
    const tableInfo = await db.all("PRAGMA table_info(users)");
    const expectedColumns = [
      "id",
      "email",
      "user_id",
      "password",
      "full_name",
      "phone_number",
      "address",
      "date_of_birth",
      "marital_status",
      "spouse_name",
      "spouse_id",
      "children_count",
    ];

    const currentColumns = tableInfo.map((column) => column.name);
    const hasCorrectStructure = expectedColumns.every((column) =>
      currentColumns.includes(column)
    );

    if (!hasCorrectStructure) {
      console.log(
        "Table structure is incorrect. Dropping and recreating the table."
      );
      await db.exec("DROP TABLE IF EXISTS users");
      await db.exec(`
        CREATE TABLE users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE,
          user_id TEXT UNIQUE,
          password TEXT,
          full_name TEXT,
          phone_number TEXT,
          address TEXT,
          date_of_birth TEXT,
          marital_status TEXT,
          spouse_name TEXT,
          spouse_id TEXT,
          children_count INTEGER
        )
      `);
    }

    console.log("Database initialized successfully");
    await logTableStructure();
  } catch (error) {
    console.error("Database initialization error:", error);
  }
}

async function logTableStructure() {
  try {
    const tableInfo = await db.all("PRAGMA table_info(users)");
    console.log("Current table structure:");
    console.log(tableInfo);
  } catch (error) {
    console.error("Error logging table structure:", error);
  }
}

// Initialize the database
initializeDatabase();

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Qtax API server" });
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
    console.log("Error details:", error.message);
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

// Update user's additional information (Page1)
app.post("/api/users/:id/additional-info", async (req, res) => {
  const { id } = req.params;
  console.log("Received additional info for user ID:", id);
  console.log("Request body:", req.body);

  const { fullName, phoneNumber, address, dateOfBirth, occupation } = req.body;

  try {
    const result = await db.run(
      `UPDATE users 
       SET full_name = ?, phone_number = ?, address = ?, date_of_birth = ?, occupation = ? 
       WHERE user_id = ?`,
      [fullName, phoneNumber, address, dateOfBirth, occupation, id]
    );

    console.log("Update result:", result);

    if (result.changes === 0) {
      console.log("No user found with ID:", id);
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Additional information saved successfully" });
  } catch (error) {
    console.error("Error saving additional information:", error);
    console.error("SQL Error Code:", error.code);
    console.error("SQL Error Message:", error.message);
    res.status(500).json({
      message: "Error saving additional information",
      error: error.message,
      sqlErrorCode: error.code,
    });
  }
});

// Update user's family information (Page2)
app.post("/api/users/:id/family-info", async (req, res) => {
  const { id } = req.params;
  const { maritalStatus, spouseName, spouseId, childrenCount } = req.body;

  try {
    const result = await db.run(
      `UPDATE users 
       SET marital_status = ?, spouse_name = ?, spouse_id = ?, children_count = ?
       WHERE user_id = ?`,
      [maritalStatus, spouseName, spouseId, childrenCount, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Family information saved successfully" });
  } catch (error) {
    console.error("Error saving family information:", error);
    console.error("SQL Error Code:", error.code);
    console.error("SQL Error Message:", error.message);
    res.status(500).json({
      message: "Error saving family information",
      error: error.message,
      sqlErrorCode: error.code,
    });
  }
});

// Get all users (for admin portal)
app.get("/api/users", async (req, res) => {
  try {
    const users = await db.all(`
      SELECT email, user_id, full_name, phone_number, address, date_of_birth, occupation,
             marital_status, spouse_name, spouse_id, children_count
      FROM users
    `);
    console.log("Fetched users:", users.length);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing email or password" });
  }

  try {
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful", userId: user.user_id });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
});

// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.get("SELECT * FROM users WHERE user_id = ?", [id]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove sensitive information before sending
    delete user.password;

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
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
