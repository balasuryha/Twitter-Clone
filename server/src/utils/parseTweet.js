import Profile from "../models/profile.js";

/** Escape regex special chars */
function rxEscape(s = "") {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extract hashtags (unicode) and case-insensitive @mentions.
 * - hashtags: array of lowercase strings (without '#')
 * - mentions: array of Profile ObjectIds
 */
export async function extractEntities(text = "") {
  const t = String(text);

  // Unicode hashtags: letters/numbers/underscore, 1..50 chars
  const hashtags = Array.from(
    new Set([...t.matchAll(/#([\p{L}\p{N}_]{1,50})/gu)].map((m) => m[1].toLowerCase()))
  );

  // Mentions: 1..15 [A-Za-z0-9_], then resolve case-insensitively
  const handles = Array.from(
    new Set([...t.matchAll(/@([A-Za-z0-9_]{1,15})/g)].map((m) => m[1]))
  ).slice(0, 50); // safety cap

  let mentions = [];
  if (handles.length) {
    const regexes = handles.map((h) => new RegExp(`^${rxEscape(h)}$`, "i"));
    const users = await Profile.find({ username: { $in: regexes } }, { _id: 1 }).lean();
    mentions = users.map((u) => u._id);
  }

  return { hashtags, mentions };
}
