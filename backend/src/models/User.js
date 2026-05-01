import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    password_hash: { type: String, required: true, select: false },
    job_type: {
      type: String,
      enum: ["student", "mini_job", "part_time", "full_time"],
      default: "student",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password_hash;
        return ret;
      },
    },
  }
);

export default mongoose.model("User", userSchema);
