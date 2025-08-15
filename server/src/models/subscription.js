import mongoose from "mongoose";
const { Schema, model } = mongoose;

const subscriptionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Profile", index: true, required: true },
    endpoint: { type: String, required: true, unique: true },
    expirationTime: { type: Number, default: null },
    keys: {
      p256dh: { type: String, required: true },
      auth:   { type: String, required: true },
    },
    userAgent: String,
  },
  { timestamps: true, collection: "push_subscriptions" }
);

export default model("PushSubscription", subscriptionSchema);
