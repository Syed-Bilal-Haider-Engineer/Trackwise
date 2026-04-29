import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { requireAuth } from "../middleware/auth.js";
import { getDB } from "../models/db.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = `/app/uploads/${req.userId}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"));
    }
  },
});

// Get all documents
router.get("/", requireAuth, (req, res) => {
  const db = getDB();
  const docs = db
    .prepare("SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC")
    .all(req.userId);

  // Compute days until expiry
  const today = new Date();
  const enriched = docs.map((doc) => {
    if (doc.expiry_date) {
      const exp = new Date(doc.expiry_date);
      const daysLeft = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
      return { ...doc, days_until_expiry: daysLeft };
    }
    return { ...doc, days_until_expiry: null };
  });

  res.json({ documents: enriched });
});

// Create document
router.post("/", requireAuth, upload.single("file"), (req, res) => {
  const { name, type, expiry_date, notes } = req.body;
  if (!name || !type) return res.status(400).json({ error: "Name and type required" });

  const db = getDB();
  const id = uuid();
  const file_path = req.file ? `/uploads/${req.userId}/${req.file.filename}` : null;

  db.prepare(
    "INSERT INTO documents (id, user_id, name, type, file_path, expiry_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(id, req.userId, name, type, file_path, expiry_date || null, notes || null);

  const doc = db.prepare("SELECT * FROM documents WHERE id = ?").get(id);
  res.status(201).json({ document: doc });
});

// Update document
router.patch("/:id", requireAuth, upload.single("file"), (req, res) => {
  const db = getDB();
  const doc = db
    .prepare("SELECT * FROM documents WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!doc) return res.status(404).json({ error: "Document not found" });

  const { name, type, expiry_date, notes, status } = req.body;
  const file_path = req.file ? `/uploads/${req.userId}/${req.file.filename}` : doc.file_path;

  db.prepare(
    `UPDATE documents SET 
      name = ?, type = ?, file_path = ?, expiry_date = ?, notes = ?, status = ?,
      updated_at = datetime('now')
    WHERE id = ? AND user_id = ?`
  ).run(
    name || doc.name,
    type || doc.type,
    file_path,
    expiry_date !== undefined ? expiry_date : doc.expiry_date,
    notes !== undefined ? notes : doc.notes,
    status || doc.status,
    req.params.id,
    req.userId
  );

  const updated = db.prepare("SELECT * FROM documents WHERE id = ?").get(req.params.id);
  res.json({ document: updated });
});

// Delete document
router.delete("/:id", requireAuth, (req, res) => {
  const db = getDB();
  const doc = db
    .prepare("SELECT * FROM documents WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!doc) return res.status(404).json({ error: "Document not found" });

  // Remove file
  if (doc.file_path) {
    try {
      fs.unlinkSync(`/app${doc.file_path}`);
    } catch {}
  }

  db.prepare("DELETE FROM documents WHERE id = ? AND user_id = ?").run(req.params.id, req.userId);
  res.json({ success: true });
});

export default router;
