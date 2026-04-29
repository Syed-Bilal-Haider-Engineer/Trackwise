import { Router } from "express";
import { v4 as uuid } from "uuid";
import { requireAuth } from "../middleware/auth.js";
import { getDB } from "../models/db.js";

const router = Router();

// German student work rules
const RULES = {
  student: {
    max_full_days_per_year: 140,
    full_day_threshold: 4, // hours >= 4 = full day
    half_day_hours: 4,
  },
  mini_job: {
    max_hours_per_month: 30,
    max_days_per_week: 10,
    hours_per_day: 3,
  },
  part_time: { max_hours_per_month: 80 },
  full_time: { max_hours_per_month: 180 },
};

function computeStats(entries, jobType) {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const yearEntries = entries.filter((e) => new Date(e.date) >= yearStart);
  const monthEntries = entries.filter((e) => new Date(e.date) >= monthStart);

  const totalHoursYear = yearEntries.reduce((s, e) => s + e.hours, 0);
  const totalHoursMonth = monthEntries.reduce((s, e) => s + e.hours, 0);

  // Student-specific: count full days and half days
  let fullDays = 0;
  let halfDays = 0;
  if (jobType === "student") {
    for (const entry of yearEntries) {
      if (entry.hours >= RULES.student.full_day_threshold) fullDays++;
      else halfDays++;
    }
  }

  return {
    total_hours_this_year: totalHoursYear,
    total_hours_this_month: totalHoursMonth,
    full_days_this_year: fullDays,
    half_days_this_year: halfDays,
    entries_this_month: monthEntries.length,
    rules: RULES[jobType] || RULES.student,
  };
}

// Get all time entries
router.get("/", requireAuth, (req, res) => {
  const db = getDB();
  const { month, year } = req.query;
  const user = db.prepare("SELECT job_type FROM users WHERE id = ?").get(req.userId);

  let query = "SELECT * FROM time_entries WHERE user_id = ?";
  const params = [req.userId];

  if (year && month) {
    query += " AND strftime('%Y', date) = ? AND strftime('%m', date) = ?";
    params.push(year, month.padStart(2, "0"));
  } else if (year) {
    query += " AND strftime('%Y', date) = ?";
    params.push(year);
  }

  query += " ORDER BY date DESC";
  const entries = db.prepare(query).all(...params);

  const allEntries = db
    .prepare("SELECT * FROM time_entries WHERE user_id = ?")
    .all(req.userId);

  const stats = computeStats(allEntries, user?.job_type || "student");

  res.json({ entries, stats });
});

// Add time entry
router.post("/", requireAuth, (req, res) => {
  const { job_name, job_type, date, hours, notes } = req.body;
  if (!job_name || !date || !hours) {
    return res.status(400).json({ error: "job_name, date, and hours are required" });
  }

  const db = getDB();
  const id = uuid();
  db.prepare(
    "INSERT INTO time_entries (id, user_id, job_name, job_type, date, hours, notes) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).run(id, req.userId, job_name, job_type || "student", date, parseFloat(hours), notes || null);

  const entry = db.prepare("SELECT * FROM time_entries WHERE id = ?").get(id);
  res.status(201).json({ entry });
});

// Update time entry
router.patch("/:id", requireAuth, (req, res) => {
  const db = getDB();
  const entry = db
    .prepare("SELECT * FROM time_entries WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!entry) return res.status(404).json({ error: "Entry not found" });

  const { job_name, job_type, date, hours, notes } = req.body;
  db.prepare(
    "UPDATE time_entries SET job_name = ?, job_type = ?, date = ?, hours = ?, notes = ? WHERE id = ? AND user_id = ?"
  ).run(
    job_name || entry.job_name,
    job_type || entry.job_type,
    date || entry.date,
    hours !== undefined ? parseFloat(hours) : entry.hours,
    notes !== undefined ? notes : entry.notes,
    req.params.id,
    req.userId
  );

  const updated = db.prepare("SELECT * FROM time_entries WHERE id = ?").get(req.params.id);
  res.json({ entry: updated });
});

// Delete time entry
router.delete("/:id", requireAuth, (req, res) => {
  const db = getDB();
  const entry = db
    .prepare("SELECT * FROM time_entries WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.userId);
  if (!entry) return res.status(404).json({ error: "Entry not found" });

  db.prepare("DELETE FROM time_entries WHERE id = ? AND user_id = ?").run(
    req.params.id,
    req.userId
  );
  res.json({ success: true });
});

// Summary endpoint
router.get("/summary", requireAuth, (req, res) => {
  const db = getDB();
  const user = db.prepare("SELECT job_type FROM users WHERE id = ?").get(req.userId);
  const allEntries = db
    .prepare("SELECT * FROM time_entries WHERE user_id = ?")
    .all(req.userId);

  const stats = computeStats(allEntries, user?.job_type || "student");

  // Per-job breakdown this month
  const now = new Date();
  const monthEntries = allEntries.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const byJob = {};
  for (const entry of monthEntries) {
    if (!byJob[entry.job_name]) byJob[entry.job_name] = { hours: 0, days: 0 };
    byJob[entry.job_name].hours += entry.hours;
    byJob[entry.job_name].days++;
  }

  res.json({ stats, by_job: byJob });
});

export default router;
