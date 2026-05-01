import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import TimeEntry from "../models/TimeEntry.js";

const router = Router();

// German student work rules
const RULES = {
  student: {
    max_full_days_per_year: 140,
    full_day_threshold: 4,
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
router.get("/", requireAuth, async (req, res) => {
  const { month, year } = req.query;
  const user = await User.findById(req.userId).select("job_type").lean();

  const filter = { user_id: req.userId };
  if (year && month) {
    filter.date = new RegExp(`^${year}-${String(month).padStart(2, "0")}-`);
  } else if (year) {
    filter.date = new RegExp(`^${year}-`);
  }

  const [entriesDocs, allEntriesDocs] = await Promise.all([
    TimeEntry.find(filter).sort({ date: -1, created_at: -1 }),
    TimeEntry.find({ user_id: req.userId }),
  ]);

  const entries = entriesDocs.map((d) => d.toJSON());
  const allEntries = allEntriesDocs.map((d) => d.toJSON());
  const stats = computeStats(allEntries, user?.job_type || "student");

  res.json({ entries, stats });
});

// Add time entry
router.post("/", requireAuth, async (req, res) => {
  const { job_name, job_type, date, hours, notes } = req.body;
  if (!job_name || !date || !hours) {
    return res.status(400).json({ error: "job_name, date, and hours are required" });
  }

  const entry = await TimeEntry.create({
    user_id: req.userId,
    job_name,
    job_type: job_type || "student",
    date,
    hours: Number(hours),
    notes: notes || null,
  });

  res.status(201).json({ entry: entry.toJSON() });
});

// Update time entry
router.patch("/:id", requireAuth, async (req, res) => {
  const entry = await TimeEntry.findOne({ _id: req.params.id, user_id: req.userId });
  if (!entry) return res.status(404).json({ error: "Entry not found" });

  const { job_name, job_type, date, hours, notes } = req.body;
  if (job_name !== undefined) entry.job_name = job_name;
  if (job_type !== undefined) entry.job_type = job_type;
  if (date !== undefined) entry.date = date;
  if (hours !== undefined) entry.hours = Number(hours);
  if (notes !== undefined) entry.notes = notes;

  await entry.save();
  res.json({ entry: entry.toJSON() });
});

// Delete time entry
router.delete("/:id", requireAuth, async (req, res) => {
  const deleted = await TimeEntry.findOneAndDelete({ _id: req.params.id, user_id: req.userId });
  if (!deleted) return res.status(404).json({ error: "Entry not found" });
  res.json({ success: true });
});

// Summary endpoint
router.get("/summary", requireAuth, async (req, res) => {
  const [user, allEntriesDocs] = await Promise.all([
    User.findById(req.userId).select("job_type").lean(),
    TimeEntry.find({ user_id: req.userId }),
  ]);

  const allEntries = allEntriesDocs.map((d) => d.toJSON());
  const stats = computeStats(allEntries, user?.job_type || "student");

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
