import PushSubscription from "../models/subscription.js";

export const getPublicKey = (req, res) => {
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

export const subscribe = async (req, res) => {
  const userId = req.user._id;
  const sub = req.body;
  if (!sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) {
    return res.status(400).json({ message: "Invalid subscription" });
  }
  await PushSubscription.updateOne(
    { endpoint: sub.endpoint },
    { ...sub, userId, userAgent: req.headers["user-agent"] || "" },
    { upsert: true }
  );
  res.status(201).json({ ok: true });
};

export const unsubscribe = async (req, res) => {
  const userId = req.user._id;
  const { endpoint } = req.body || {};
  if (!endpoint) return res.status(400).json({ message: "Missing endpoint" });
  await PushSubscription.deleteOne({ endpoint, userId });
  res.json({ ok: true });
};
