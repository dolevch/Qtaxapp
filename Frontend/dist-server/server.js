import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcrypt";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());
let db;
(async () => {
  try {
    db = await open({
      filename: "./database.sqlite",
      driver: sqlite3.Database
    });
    await db.get("SELECT 1", [], (err, result) => {
      if (err) {
        console.error("Database connection error:", err);
      } else {
        console.log(
          "Database connected successfully. Test query result:",
          result
        );
      }
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
app.post("/api/signup", async (req, res) => {
  console.log("Received signup request:", req.body);
  const { email, id, password } = req.body;
  if (!email || !id || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      "INSERT INTO users (email, user_id, password) VALUES (?, ?, ?)",
      [email, id, hashedPassword]
    );
    console.log("User created successfully");
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "SQLITE_CONSTRAINT") {
      res.status(409).json({ message: "Email or user ID already exists" });
    } else {
      res.status(500).json({ message: "Error creating user" });
    }
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await db.all("SELECT email, user_id FROM users");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});
const PORT = process.env.PORT || 5e3;
{
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
const viteNodeApp = app;
export {
  viteNodeApp
};
