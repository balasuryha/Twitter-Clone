import Tweet from "../models/tweet.js";
import Profile from "../models/profile.js";
import { extractEntities } from "../utils/parseTweet.js";

/**
 * GET /tweet/:id            -> single tweet
 * GET /tweet?page=1         -> global (tweet + retweet), newest first (cumulative pagination)
 */
export const getTweet = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const { id } = req.params || {};
    const limit = 10;
    const total = Number(page) * limit;

    if (id) {
      const tweet = await Tweet.findById(id);
      if (!tweet) return res.status(404).json({ message: "Tweet not found" });
      return res.status(200).json(tweet);
    }

    const tweets = await Tweet.find({ $or: [{ type: "tweet" }, { type: "retweet" }] })
      .sort("-createdAt")
      .limit(total);

    return res.status(200).json(tweets);
  } catch (e) {
    console.error("getTweet error:", e);
    return res.status(500).json({ message: "Failed to fetch tweet(s)" });
  }
};

/**
 * GET /tweet/following?page=1  (auth)
 * Returns current user's + following users' tweets/retweets
 */
export const getFollowingTweets = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const user = req.user;
    const limit = 10;
    const total = Number(page) * limit;

    // Ensure we query by ObjectIds, not populated docs
    const followingIds = (user.following || []).map((f) => f._id || f);
    const authors = [...followingIds, user._id];

    const tweets = await Tweet.find({
      author: { $in: authors },
      $or: [{ type: "tweet" }, { type: "retweet" }],
    })
      .sort("-createdAt")
      .limit(total);

    return res.status(200).json(tweets);
  } catch (e) {
    console.error("getFollowingTweets error:", e);
    return res.status(500).json({ message: "Failed to fetch following feed" });
  }
};

/**
 * GET /tweet/profile?username=someone  (auth)
 */
export const getProfileTweets = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ message: "username is required" });

    const profile = await Profile.findOne({ username });
    if (!profile) return res.status(404).json({ message: "User not found" });

    const tweets = await Tweet.find({ author: profile._id })
      .sort("-createdAt");

    return res.status(200).json(tweets);
  } catch (e) {
    console.error("getProfileTweets error:", e);
    return res.status(500).json({ message: "Failed to fetch profile tweets" });
  }
};

/**
 * POST /tweet/new  (auth)
 * Body: { body: string, media?: string[] }  // media = array of image URLs from /uploads-api/image
 */
export const newTweet = async (req, res) => {
  try {
    const user = req.user;
    const { body = "", media = [] } = req.body || {};

    const text = String(body || "").trim();
    if (!text && (!media || media.length === 0)) {
      return res.status(400).json({ message: "Tweet cannot be empty" });
    }
    if (text.length > 280) {
      return res.status(400).json({ message: "Tweet exceeds 280 characters" });
    }

    // Only allow images here, cap at 4
    const normalizedMedia = (media || [])
      .slice(0, 4)
      .filter((u) => typeof u === "string" && u.startsWith("http"))
      .map((url) => ({ type: "image", url }));

    const { hashtags, mentions } = await extractEntities(text);

    const tweet = await Tweet.create({
      type: "tweet",
      body: text,
      author: user._id,
      media: normalizedMedia,
      hashtags,
      mentions,
    });

    if (typeof user.tweet === "function") await user.tweet(tweet);

    const saved = await Tweet.findById(tweet._id);
    return res.status(201).json(saved);
  } catch (e) {
    console.error("newTweet error:", e);
    return res.status(500).json({ message: "Failed to create tweet" });
  }
};

/**
 * DELETE /tweet/delete/:id  (auth)
 */
export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = req.user;

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });
    if (String(tweet.author) !== String(profile._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await profile.deleteTweet(id);
    const result = await Tweet.deleteOne({ _id: id });
    return res.status(200).json(result);
  } catch (e) {
    console.error("deleteTweet error:", e);
    return res.status(500).json({ message: "Failed to delete tweet" });
  }
};

/**
 * PATCH /tweet/edit/:id  (auth)
 * Body: { body: string }
 */
export const editTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const { body = "" } = req.body;
    const user = req.user;

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });
    if (String(tweet.author) !== String(user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await user.editTweet(tweet, body);
    return res.status(200).json(tweet);
  } catch (e) {
    console.error("editTweet error:", e);
    return res.status(500).json({ message: "Failed to edit tweet" });
  }
};

/**
 * POST /tweet/like/:id   (auth)
 */
export const likeTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = req.user;

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    await profile.like(tweet);
    return res.status(200).json(tweet);
  } catch (e) {
    console.error("likeTweet error:", e);
    return res.status(500).json({ message: "Failed to like tweet" });
  }
};

/**
 * PATCH /tweet/unlike/:id   (auth)
 */
export const unlikeTweet = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = req.user;

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    await profile.unlike(tweet);
    return res.status(200).json(tweet);
  } catch (e) {
    console.error("unlikeTweet error:", e);
    return res.status(500).json({ message: "Failed to unlike tweet" });
  }
};

/**
 * POST /tweet/retweet/:id  (auth)
 */
export const retweet = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = req.user;

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    await profile.retweet(tweet);
    return res.status(200).json(profile);
  } catch (e) {
    console.error("retweet error:", e);
    return res.status(500).json({ message: "Failed to retweet" });
  }
};

/**
 * POST /tweet/reply/new/:id   (auth)
 * Body: { body: string }
 * Stores reply as a Tweet (type: 'reply') and also pushes to parent tweet.replies
 */
export const newReply = async (req, res) => {
  try {
    const { id } = req.params; // parent tweet id
    const { body = "" } = req.body;
    const profile = req.user;

    const text = String(body || "").trim();
    if (!text) return res.status(400).json({ message: "Reply cannot be empty" });

    const parent = await Tweet.findById(id);
    if (!parent) return res.status(404).json({ message: "Tweet not found" });

    const reply = await Tweet.create({
      type: "reply",
      body: text,
      author: profile._id,
    });

    if (typeof profile.newReply === "function") {
      await profile.newReply(parent, reply);
    }

    // return the parent or the new reply—your UI can handle either.
    return res.status(201).json(reply);
  } catch (e) {
    console.error("newReply error:", e);
    return res.status(500).json({ message: "Failed to create reply" });
  }
};

/**
 * DELETE /tweet/comment/delete/:id  (auth)
 * NOTE: Not implemented – depends on how replies are stored (subdocs vs separate docs)
 */
export const deleteReply = async (_req, res) => {
  return res.status(501).json({ message: "deleteReply not implemented yet" });
};
