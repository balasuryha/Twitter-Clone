// controllers/tweet.controller.js
import Tweet from "../models/tweet.js";
import Profile from "../models/profile.js";

/* ---------- GET tweets (by id or paged list) ---------- */
export const getTweet = async (req, res) => {
  try {
    const { id, page = 1 } = req.query;
    const limit = 10;
    const total = Number(page) * limit;

    if (id) {
      const tweet = await Tweet.findById(id);
      if (!tweet) return res.status(404).json({ message: "Tweet not found" });
      return res.send(tweet);
    }

    const tweets = await Tweet.find({ $or: [{ type: "tweet" }, { type: "retweet" }] })
      .sort("-createdAt")
      .limit(total);

    res.send(tweets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tweet(s)", error: err.message });
  }
};

/* ---------- GET following timeline ---------- */
export const getFollowingTweets = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const user = req.user;
    const limit = 10;
    const total = Number(page) * limit;

    const tweet = await Tweet.find({
      author: { $in: [...user.following, user._id] },
      $or: [{ type: "tweet" }, { type: "retweet" }],
    })
      .sort("-createdAt")
      .limit(total);

    res.send(tweet);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch following tweets", error: err.message });
  }
};

/* ---------- GET profile tweets ---------- */
export const getProfileTweets = async (req, res) => {
  try {
    const { username } = req.query;
    const profile = await Profile.findOne({ username });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const tweets = await Tweet.find({ author: profile._id }).sort("-createdAt");
    res.send(tweets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile tweets", error: err.message });
  }
};

/* ---------- POST new tweet (with optional poll) ---------- */
export const newTweet = async (req, res) => {
  try {
    const { body, poll } = req.body;
    const user = req.user;

    let pollData = null;
    if (poll) {
      const { question, options, durationHours = 24 } = poll;

      if (!question || !Array.isArray(options))
        return res.status(400).json({ message: "Invalid poll payload" });

      const cleanOptions = options.map((t) => String(t).trim()).filter(Boolean);
      if (cleanOptions.length < 2 || cleanOptions.length > 4) {
        return res.status(400).json({ message: "Poll must have 2–4 options" });
      }

      pollData = {
        question: String(question).trim(),
        options: cleanOptions.map((t) => ({ text: t })), // votes default to 0
        expiresAt: new Date(Date.now() + Number(durationHours) * 3600 * 1000),
        voters: [],
      };
    }

    const tweet = await Tweet.create({
      type: "tweet",
      body,
      author: user,
      ...(pollData ? { poll: pollData } : {}),
    });

    await user.tweet(tweet); // uses your Profile instance methods
    res.status(201).send(tweet);
  } catch (err) {
    res.status(500).json({ message: "Failed to create tweet", error: err.message });
  }
};

/* ---------- DELETE tweet ---------- */
export const deleteTweet = async (req, res) => {
  try {
    const { id } = req.query;
    const profile = req.user;
    await profile.deleteTweet(id);
    const result = await Tweet.deleteOne({ _id: id });
    res.send(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tweet", error: err.message });
  }
};

/* ---------- PATCH edit tweet body ---------- */
export const editTweet = async (req, res) => {
  try {
    const { id } = req.query;
    const { body } = req.body;
    const user = req.user;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });
    await user.editTweet(tweet, body);
    res.send(tweet);
  } catch (err) {
    res.status(500).json({ message: "Failed to edit tweet", error: err.message });
  }
};

/* ---------- LIKE / UNLIKE ---------- */
export const likeTweet = async (req, res) => {
  try {
    const { id } = req.query;
    const profile = req.user;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });
    await profile.like(tweet);
    res.send(tweet);
  } catch (err) {
    res.status(500).json({ message: "Failed to like", error: err.message });
  }
};

export const unlikeTweet = async (req, res) => {
  try {
    const { id } = req.query;
    const profile = req.user;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });
    await profile.unlike(tweet);
    res.send(tweet);
  } catch (err) {
    res.status(500).json({ message: "Failed to unlike", error: err.message });
  }
};

/* ---------- RETWEET ---------- */
export const retweet = async (req, res) => {
  try {
    const { id } = req.query;
    const profile = req.user;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });
    await profile.retweet(tweet);
    res.send(profile);
  } catch (err) {
    res.status(500).json({ message: "Failed to retweet", error: err.message });
  }
};

/* ---------- REPLY ---------- */
export const newReply = async (req, res) => {
  try {
    const { id } = req.query;
    const { body } = req.body;
    const profile = req.user;

    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ message: "Tweet not found" });

    const reply = await Tweet.create({
      type: "reply",
      body,
      author: profile,
    });

    await profile.newReply(tweet, reply);
    res.send(reply);
  } catch (err) {
    res.status(500).json({ message: "Failed to create reply", error: err.message });
  }
};

export const deleteReply = async (req, res) => {
  // Not implemented (kept as in your codebase)
  const { tweetId } = req.query;
  const tweet = await Tweet.findById(tweetId);
  res.send(tweet);
};

/* ---------- VOTE in poll (persist) ---------- */
export const votePoll = async (req, res) => {
  try {
    const { id } = req.query;             // /tweet/poll/vote?id=<tweetId>
    const { optionIndex } = req.body;     // { optionIndex: 0..n }
    const userId = req.user._id;

    const tweet = await Tweet.findById(id);
    if (!tweet || !tweet.poll) return res.status(404).json({ message: "Poll not found" });

    if (new Date(tweet.poll.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Poll has ended", poll: tweet.poll });
    }

    // voters may be ObjectId OR populated docs; handle both
    const alreadyVoted = tweet.poll.voters.some((v) => {
      const vid = v && v._id ? v._id : v;
      return String(vid) === String(userId);
    });
    if (alreadyVoted) {
      return res.status(409).json({ message: "You already voted", poll: tweet.poll });
    }

    if (
      typeof optionIndex !== "number" ||
      optionIndex < 0 ||
      optionIndex >= tweet.poll.options.length
    ) {
      return res.status(400).json({ message: "Invalid option index", poll: tweet.poll });
    }

    tweet.poll.options[optionIndex].votes += 1;
    tweet.poll.voters.push(userId);
    await tweet.save();

    res.json({ poll: tweet.poll });
  } catch (err) {
    res.status(500).json({ message: "Failed to vote", error: err.message });
  }
};
