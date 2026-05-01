import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { requireAuth } from "../middleware/auth.js";
import Document from "../models/Document.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `/app/uploads/${req.userId}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only PDF and image files are allowed"));
  },
});

function withExpiry(doc) {
  const out = doc.toJSON();
  if (!out.expiry_date) return { ...out, days_until_expiry: null };
  const today = new Date();
  const exp = new Date(out.expiry_date);
  const daysLeft = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  return { ...out, days_until_expiry: daysLeft };
}

// Get all documents
router.get("/", requireAuth, async (req, res) => {
  const docs = await Document.find({ user_id: req.userId }).sort({ created_at: -1 });
  res.json({ documents: docs.map(withExpiry) });
});

// Create document
router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  const { name, type, expiry_date, notes } = req.body;
  if (!name || !type) return res.status(400).json({ error: "Name and type required" });

  const file_path = req.file ? `/uploads/${req.userId}/${req.file.filename}` : null;
  const doc = await Document.create({
    user_id: req.userId,
    name,
    type,
    file_path,
    expiry_date: expiry_date || null,
    notes: notes || null,
  });

  res.status(201).json({ document: withExpiry(doc) });
});

// Update document
router.patch("/:id", requireAuth, upload.single("file"), async (req, res) => {
  const doc = await Document.findOne({ _id: req.params.id, user_id: req.userId });
  if (!doc) return res.status(404).json({ error: "Document not found" });

  const { name, type, expiry_date, notes, status } = req.body;
  if (name !== undefined) doc.name = name;
  if (type !== undefined) doc.type = type;
  if (expiry_date !== undefined) doc.expiry_date = expiry_date || null;
  if (notes !== undefined) doc.notes = notes;
  if (status !== undefined) doc.status = status;
  if (req.file) doc.file_path = `/uploads/${req.userId}/${req.file.filename}`;

  await doc.save();
  res.json({ document: withExpiry(doc) });
});

// Delete document
router.delete("/:id", requireAuth, async (req, res) => {
  const doc = await Document.findOneAndDelete({ _id: req.params.id, user_id: req.userId });
  if (!doc) return res.status(404).json({ error: "Document not found" });

  if (doc.file_path) {
    try {
      fs.unlinkSync(`/app${doc.file_path}`);
    } catch {}
  }

  res.json({ success: true });
});

export default router;
