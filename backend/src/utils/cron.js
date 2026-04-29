import cron from "node-cron";
import { getDB } from "../models/db.js";
import { v4 as uuid } from "uuid";

export function startCronJobs() {
  // Daily check at 8am: scan expiring documents and create AI insights
  cron.schedule("0 8 * * *", () => {
    console.log("⏰ Running daily expiry check...");
    checkExpiringDocuments();
  });

  // Weekly compliance check: Sunday midnight
  cron.schedule("0 0 * * 0", () => {
    console.log("⏰ Running weekly compliance check...");
    checkWorkHoursCompliance();
  });

  console.log("✅ Cron jobs started");
}

function checkExpiringDocuments() {
  const db = getDB();
  const today = new Date();

  // Get all documents with expiry dates
  const docs = db
    .prepare(
      "SELECT d.*, u.id as user_id FROM documents d JOIN users u ON d.user_id = u.id WHERE d.expiry_date IS NOT NULL AND d.status = 'active'"
    )
    .all();

  for (const doc of docs) {
    const expiry = new Date(doc.expiry_date);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    let severity = null;
    let message = null;

    if (daysLeft < 0) {
      severity = "danger";
      message = JSON.stringify({
        type: "danger",
        title: `⚠️ ${doc.name} has expired!`,
        message: `Your ${doc.type} expired ${Math.abs(daysLeft)} days ago. Take immediate action to renew it.`,
        action: "Renew immediately or contact relevant authorities",
      });
    } else if (daysLeft <= 30) {
      severity = "danger";
      message = JSON.stringify({
        type: "danger",
        title: `🔴 ${doc.name} expires in ${daysLeft} days`,
        message: `Critical: Your ${doc.type} expires very soon. Start the renewal process today.`,
        action: "Book an appointment immediately",
      });
    } else if (daysLeft <= 90) {
      severity = "warning";
      message = JSON.stringify({
        type: "warning",
        title: `⚠️ ${doc.name} expires in ${daysLeft} days`,
        message: `Your ${doc.type} expires on ${doc.expiry_date}. Begin the renewal process now to avoid issues.`,
        action: "Schedule appointment and gather required documents",
      });
    }

    if (severity && message) {
      // Check if we already have a recent insight for this document
      const existing = db
        .prepare(
          "SELECT id FROM ai_insights WHERE user_id = ? AND message LIKE ? AND created_at > datetime('now', '-7 days')"
        )
        .get(doc.user_id, `%${doc.name}%`);

      if (!existing) {
        db.prepare(
          "INSERT INTO ai_insights (id, user_id, type, message, severity) VALUES (?, ?, ?, ?, ?)"
        ).run(uuid(), doc.user_id, `Document: ${doc.name}`, message, severity);
        console.log(`📄 Expiry alert created for user ${doc.user_id}: ${doc.name}`);
      }
    }
  }
}

function checkWorkHoursCompliance() {
  const db = getDB();
  const users = db.prepare("SELECT id, job_type FROM users").all();
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  for (const user of users) {
    const yearEntries = db
      .prepare("SELECT hours FROM time_entries WHERE user_id = ? AND date >= ?")
      .all(user.id, yearStart.toISOString().split("T")[0]);

    const monthEntries = db
      .prepare("SELECT hours FROM time_entries WHERE user_id = ? AND date >= ?")
      .all(user.id, monthStart.toISOString().split("T")[0]);

    if (user.job_type === "student") {
      const fullDays = yearEntries.filter((e) => e.hours >= 4).length;
      if (fullDays >= 120) {
        const existing = db
          .prepare(
            "SELECT id FROM ai_insights WHERE user_id = ? AND type LIKE '%Work Limit%' AND created_at > datetime('now', '-7 days')"
          )
          .get(user.id);

        if (!existing) {
          db.prepare(
            "INSERT INTO ai_insights (id, user_id, type, message, severity) VALUES (?, ?, ?, ?, ?)"
          ).run(
            uuid(),
            user.id,
            "Work Limit Warning",
            JSON.stringify({
              type: "danger",
              title: "🚨 Approaching annual work limit!",
              message: `You have worked ${fullDays} full days this year. The legal limit for students is 140 full days.`,
              action: "Reduce working hours to avoid visa/permit violations",
            }),
            "danger"
          );
        }
      }
    }

    // Monthly limit check
    const monthHours = monthEntries.reduce((s, e) => s + e.hours, 0);
    const limits = { mini_job: 30, part_time: 80, full_time: 180 };
    const limit = limits[user.job_type];

    if (limit && monthHours >= limit * 0.9) {
      const existing = db
        .prepare(
          "SELECT id FROM ai_insights WHERE user_id = ? AND type LIKE '%Monthly%' AND created_at > datetime('now', '-3 days')"
        )
        .get(user.id);

      if (!existing) {
        db.prepare(
          "INSERT INTO ai_insights (id, user_id, type, message, severity) VALUES (?, ?, ?, ?, ?)"
        ).run(
          uuid(),
          user.id,
          "Monthly Hours Warning",
          JSON.stringify({
            type: "warning",
            title: `⏰ Monthly hours at ${Math.round((monthHours / limit) * 100)}%`,
            message: `You've worked ${monthHours.toFixed(1)} of ${limit} allowed hours this month.`,
            action: `You have ${(limit - monthHours).toFixed(1)} hours remaining this month`,
          }),
          "warning"
        );
      }
    }
  }
}
