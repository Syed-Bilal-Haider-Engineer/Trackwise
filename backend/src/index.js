import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "./.env"),
});
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./models/db.js";
import authRouter from "./routes/auth.js";
import documentsRouter from "./routes/documents.js";
import timeRouter from "./routes/time.js";
import aiRouter from "./routes/ai.js";
import { startCronJobs } from "./utils/cron.js";
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/auth", authRouter);
app.use("/documents", documentsRouter);
app.use("/time", timeRouter);
app.use("/ai", aiRouter);

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "../app/uploads")));

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// Init
connectDB();
startCronJobs();

app.listen(PORT, () => {
  console.log(`🚀 TrackWise API running on port ${PORT}`);
});
