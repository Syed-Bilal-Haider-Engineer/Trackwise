import cron from "node-cron";
import AiInsight from "../models/AiInsight.js";
import Document from "../models/Document.js";
import TimeEntry from "../models/TimeEntry.js";
import User from "../models/User.js";

export function startCronJobs() {
  cron.schedule("0 8 * * *", async () => {
    console.log("⏰ Running daily expiry check...");
    await checkExpiringDocuments();
  });

  cron.schedule("0 0 * * 0", async () => {
    console.log("⏰ Running weekly compliance check...");
    await checkWorkHoursCompliance();
  });

  console.log("✅ Cron jobs started");
}

async function checkExpiringDocuments() {
  const today = new Date();
  const docs = await Document.find({ expiry_date: { $ne: null }, status: "active" }).lean();

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
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const existing = await AiInsight.findOne({
        user_id: doc.user_id,
        message: { $regex: doc.name, $options: "i" },
        created_at: { $gt: sevenDaysAgo },
      }).lean();

      if (!existing) {
        await AiInsight.create({
          user_id: doc.user_id,
          type: `Document: ${doc.name}`,
          message,
          severity,
        });
        console.log(`📄 Expiry alert created for user ${doc.user_id}: ${doc.name}`);
      }
    }
  }
}

async function checkWorkHoursCompliance() {
  const users = await User.find({}).select("_id job_type").lean();
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  for (const user of users) {
    const entries = await TimeEntry.find({ user_id: user._id }).select("hours date").lean();
    const yearEntries = entries.filter((e) => new Date(e.date) >= yearStart);
    const monthEntries = entries.filter((e) => new Date(e.date) >= monthStart);

    if (user.job_type === "student") {
      const fullDays = yearEntries.filter((e) => e.hours >= 4).length;
      if (fullDays >= 120) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const existing = await AiInsight.findOne({
          user_id: user._id,
          type: { $regex: "Work Limit", $options: "i" },
          created_at: { $gt: sevenDaysAgo },
        }).lean();

        if (!existing) {
          await AiInsight.create({
            user_id: user._id,
            type: "Work Limit Warning",
            message: JSON.stringify({
              type: "danger",
              title: "🚨 Approaching annual work limit!",
              message: `You have worked ${fullDays} full days this year. The legal limit for students is 140 full days.`,
              action: "Reduce working hours to avoid visa/permit violations",
            }),
            severity: "danger",
          });
        }
      }
    }

    const monthHours = monthEntries.reduce((s, e) => s + e.hours, 0);
    const limits = { mini_job: 30, part_time: 80, full_time: 180 };
    const limit = limits[user.job_type];

    if (limit && monthHours >= limit * 0.9) {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const existing = await AiInsight.findOne({
        user_id: user._id,
        type: { $regex: "Monthly", $options: "i" },
        created_at: { $gt: threeDaysAgo },
      }).lean();

      if (!existing) {
        await AiInsight.create({
          user_id: user._id,
          type: "Monthly Hours Warning",
          message: JSON.stringify({
            type: "warning",
            title: `⏰ Monthly hours at ${Math.round((monthHours / limit) * 100)}%`,
            message: `You've worked ${monthHours.toFixed(1)} of ${limit} allowed hours this month.`,
            action: `You have ${(limit - monthHours).toFixed(1)} hours remaining this month`,
          }),
          severity: "warning",
        });
      }
    }
  }
}
