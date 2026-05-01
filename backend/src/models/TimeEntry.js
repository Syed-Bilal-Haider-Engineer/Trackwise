import mongoose from "mongoose";

const timeEntrySchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    job_name: { type: String, required: true, trim: true },
    job_type: {
      type: String,
      enum: ["student", "mini_job", "part_time", "full_time"],
      default: "student",
    },
    date: { type: String, required: true }, // yyyy-mm-dd
    hours: { type: Number, required: true },
    notes: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.user_id = ret.user_id?.toString?.() || ret.user_id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.model("TimeEntry", timeEntrySchema);
