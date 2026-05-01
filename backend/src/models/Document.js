import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    file_path: { type: String, default: null },
    expiry_date: { type: String, default: null }, // yyyy-mm-dd
    notes: { type: String, default: null },
    status: { type: String, default: "active" },
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

export default mongoose.model("Document", documentSchema);
