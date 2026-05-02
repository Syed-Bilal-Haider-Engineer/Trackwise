import { Router } from "express";
import bcrypt from "bcryptjs";
import { signToken, requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

// Register
router.post("/register", async (req, res) => {
  const { email, name, password, job_type } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail }).select("_id").lean();
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const password_hash = await bcrypt.hash(password, 12);
    const user = await User.create({
      email: normalizedEmail,
      name,
      password_hash,
      job_type: job_type || "student",
    });

    const token = signToken(user.id);
    console.log(`New user registered: ${email} (${user.id})`);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing credentials" });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password_hash");
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user.id);
    res.json({ token, user: user.toJSON() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Me
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: user.toJSON() });
});

// Update profile
router.patch("/me", requireAuth, async (req, res) => {
  const { name, job_type, password } = req.body;

  const user = await User.findById(req.userId).select("+password_hash");
  if (!user) return res.status(404).json({ error: "User not found" });

  if (name !== undefined) user.name = name;
  if (job_type !== undefined) user.job_type = job_type;
  if (password) user.password_hash = await bcrypt.hash(password, 12);

  await user.save();
  res.json({ user: user.toJSON() });
});

export default router;
