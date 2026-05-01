import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "../middleware/auth.js";
import User from "../models/User.js";
import TimeEntry from "../models/TimeEntry.js";
import Document from "../models/Document.js";
import AiInsight from "../models/AiInsight.js";

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function buildUserContext(userId) {
  const [user, allEntriesDocs, docsDocs] = await Promise.all([
    User.findById(userId).select("name job_type").lean(),
    TimeEntry.find({ user_id: userId }),
    Document.find({ user_id: userId }).select("name type expiry_date"),
  ]);

  const allEntries = allEntriesDocs.map((d) => d.toJSON());
  const docs = docsDocs.map((d) => d.toJSON());

  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const yearEntries = allEntries.filter((e) => new Date(e.date) >= yearStart);
  const monthEntries = allEntries.filter((e) => new Date(e.date) >= monthStart);

  const totalHoursYear = yearEntries.reduce((s, e) => s + e.hours, 0);
  const totalHoursMonth = monthEntries.reduce((s, e) => s + e.hours, 0);
  const fullDays = yearEntries.filter((entry) => entry.hours >= 4).length;

  const docsWithExpiry = docs
    .filter((d) => d.expiry_date)
    .map((d) => {
      const daysLeft = Math.ceil((new Date(d.expiry_date) - now) / (1000 * 60 * 60 * 24));
      return { ...d, days_left: daysLeft };
    })
    .sort((a, b) => a.days_left - b.days_left);

  return {
    user,
    time: {
      job_type: user?.job_type,
      total_hours_this_year: totalHoursYear,
      total_hours_this_month: totalHoursMonth,
      full_days_this_year: fullDays,
      days_remaining_if_student: 140 - fullDays,
    },
    documents: {
      total: docs.length,
      expiring_soon: docsWithExpiry.filter((d) => d.days_left <= 90),
      expired: docsWithExpiry.filter((d) => d.days_left < 0),
    },
  };
}

router.get("/insights", requireAuth, async (req, res) => {
  try {
    const context = await buildUserContext(req.userId);

    const systemPrompt = `You are TrackWise AI, a compliance assistant for international students in Germany.
You help students avoid legal issues with work permits, visa rules, and document expiry.
German rules:
- Students can work max 140 full days OR 280 half days per year (a full day = 4+ hours)
- Mini-job: max 30 hours/month, ~3h/day
- Part-time: max 80 hours/month
- Full-time: max 180 hours/month
- Visa must be renewed before expiry; apply 3 months before
- Documents like residence permit, health insurance are legally required
Be concise, practical, and action-oriented. Respond in JSON format only.`;

    const userMessage = `Based on this user's current data, provide 3-5 actionable AI insights:
${JSON.stringify(context, null, 2)}

Respond with JSON: { "insights": [ { "type": "warning|info|danger|success", "title": "...", "message": "...", "action": "..." } ] }`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    await AiInsight.deleteMany({ user_id: req.userId, is_read: false });
    await AiInsight.insertMany(
      parsed.insights.map((insight) => ({
        user_id: req.userId,
        type: insight.title,
        message: JSON.stringify(insight),
        severity: insight.type,
      }))
    );

    res.json({ insights: parsed.insights, context });
  } catch (err) {
    console.error("AI insight error:", err);
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

router.post("/ask", requireAuth, async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question required" });

  try {
    const context = await buildUserContext(req.userId);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system: `You are TrackWise AI assistant for international students in Germany.
Help with work hour limits, visa rules, document expiry, and German bureaucracy.
Be concise and practical. The user's current data: ${JSON.stringify(context)}`,
      messages: [{ role: "user", content: question }],
    });

    const answer = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    res.json({ answer });
  } catch (err) {
    console.error("AI ask error:", err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

router.get("/stored", requireAuth, async (req, res) => {
  const insights = await AiInsight.find({ user_id: req.userId }).sort({ created_at: -1 }).limit(20);
  res.json({ insights: insights.map((i) => i.toJSON()) });
});

router.patch("/stored/:id/read", requireAuth, async (req, res) => {
  await AiInsight.updateOne({ _id: req.params.id, user_id: req.userId }, { $set: { is_read: true } });
  res.json({ success: true });
});

export default router;
