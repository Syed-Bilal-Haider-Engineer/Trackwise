import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { getDB } from "../models/db.js";
import { signToken, requireAuth } from "../middleware/auth.js";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { email, name, password, job_type } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const db = getDB();
    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 12);
    const id = uuid();
    db.prepare(
      "INSERT INTO users (id, email, name, password_hash, job_type) VALUES (?, ?, ?, ?, ?)"
    ).run(id, email.toLowerCase(), name, hash, job_type || "student");

    const token = signToken(id);
    res.status(201).json({ token, user: { id, email, name, job_type: job_type || "student" } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

  try {
    const db = getDB();
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase());
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user.id);
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, job_type: user.job_type },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Me
router.get("/me", requireAuth, (req, res) => {
  const db = getDB();
  const user = db
    .prepare("SELECT id, email, name, job_type, created_at FROM users WHERE id = ?")
    .get(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
});

// Update profile
router.patch("/me", requireAuth, async (req, res) => {
  const { name, job_type, password } = req.body;
  const db = getDB();
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const updates = {
    name: name || user.name,
    job_type: job_type || user.job_type,
    password_hash: user.password_hash,
  };

  if (password) {
    updates.password_hash = await bcrypt.hash(password, 12);
  }

  db.prepare(
    "UPDATE users SET name = ?, job_type = ?, password_hash = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(updates.name, updates.job_type, updates.password_hash, req.userId);

  const updated = db
    .prepare("SELECT id, email, name, job_type FROM users WHERE id = ?")
    .get(req.userId);
  res.json({ user: updated });
});

export default router;
