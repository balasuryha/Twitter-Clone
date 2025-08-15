import webpush from "web-push";
import PushSubscription from "../models/subscription.js";

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;

webpush.setVapidDetails(
  VAPID_SUBJECT || "mailto:admin@example.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// payload: { title, body, url? }
export async function sendPushToUser(userId, payload) {
  const subs = await PushSubscription.find({ userId });
  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub.toObject(), JSON.stringify(payload));
      } catch (err) {
        // remove dead subscriptions
        if (err.statusCode === 404 || err.statusCode === 410) {
          try { await PushSubscription.deleteOne({ _id: sub._id }); } catch {}
        } else {
          console.error("webpush error:", err.statusCode, err.body || err.message);
        }
      }
    })
  );
}
