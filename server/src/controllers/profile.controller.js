import Profile from "../models/profile.js";
import Tweet from "../models/tweet.js";
import bcrypt from 'bcryptjs';
import generateToken from "../utils/generateToken.js";
import mongoose from "mongoose";

// SIGN UP
export const signUp = async (req, res) => {
  const { username, email } = req.body;
  const user = await Profile.findOne({
    $or: [{ email: email }, { username: username }],
  });
  if (user)
    return res
      .status(401)
      .json({ errors: [{ msg: "This user is already exist" }] });

  const profile = await Profile.create(req.body);
  const token = profile && generateToken(profile._id);
  return res
    .cookie("access_token", token, {
      httpOnly: true,
    })
    .status(200)
    .json(profile);
};

// SIGN IN
export const signIn = async (req, res) => {
  const { username, password } = req.body;

  const profile = await Profile.findOne({
    $or: [{ username: username }, { email: username }],
  });
  const bcryptedPasword =
    profile && (await bcrypt.compare(password, profile.password));

  if (bcryptedPasword && profile) {
    const token = generateToken(profile._id);
    await profile.signIn();
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(profile);
  } else {
    res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
  }
};

export const signOut = async (req, res) => {
  const profile = req.user;
  await profile.signOut();
  return res
    .cookie("access_token", "", {
      httpOnly: true,
    })
    .status(200)
    .json({ msg: "Successfully signed out." });
};

// FOLLOW PROFILE
export const follow = async (req, res) => {
  const { username } = req.query;
  const user = req.user;

  const profile = await Profile.findOne({ username: username });
  await user.follow(profile);
  res.send(profile);
};

//UNFOLLOW PROFILE
export const unfollow = async (req, res) => {
  const { username } = req.query;
  const user = req.user;
  const profile = await Profile.findOne({ username: username });
  await user.unfollow(profile);
  return res.json(profile);
};

// GET PROFILE BY USERNAME OR ALL
export const getProfile = async (req, res) => {
  const { username } = req.query;
  if (username) {
    const profile = await Profile.findOne(
      { username: username },
      { password: 0 }
    );
    res.send(profile);
  } else {
    const profile = await Profile.find({}, { password: 0 });
    res.send(profile);
  }
};

export const getCurrentProfile = (req, res) => {
  const profile = req.user;
  res.send(profile);
};

// BOOKMARKS
export const addBookmark = async (req, res) => {
  const { id } = req.query;
  const profile = req.user;
  const tweet = await Tweet.findOne({ _id: id });
  await profile.addBookmark(tweet);
  res.send(profile);
};

export const getBookmarks = async (req, res) => {
  const { user } = req;

  const bookmarks = await Tweet.find({
    _id: { $in: user.bookmarks },
    $or: [{ type: "tweet" }, { type: "retweet" }],
  }).sort("-createdAt");

  res.send(bookmarks);
};

export const removeBookmark = async (req, res) => {
  const { id } = req.query;
  const profile = req.user;
  const tweet = await Tweet.findOne({ _id: id });
  await profile.removeBookmark(tweet);
  res.send(profile);
};

// EDIT PROFILE BIO
export const uploadAvatar = async (req, res) => {
  const { user, avatar } = req;
  await user.changeAvatar(avatar);
  res.send(user);
};

export const editProfile = async (req, res) => {
  const { user } = req;
  const body = req.body;
  await user.updateProfile(body);
  res.send(user);
};



export const searchProfiles = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || "20", 10)));
    const skip = (page - 1) * limit;

    if (!q) return res.json({ results: [], page, hasMore: false });

    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(esc, "i");

    const followingIds = (req.user?.following || []).map((v) =>
      new mongoose.Types.ObjectId(String(v?._id ?? v))
    );

    const baseProject = {
      _id: 1, username: 1, fname: 1, lname: 1, avatar: 1, bio: 1,
      followersCount: 1, followingCount: 1, isFollowing: 1,
    };

    const pipelineText = [
      { $match: { $text: { $search: q } } },
      { $addFields: {
          followersCount: { $size: { $ifNull: ["$followers", []] } },
          followingCount: { $size: { $ifNull: ["$following", []] } },
          isFollowing: { $in: ["$_id", followingIds] },
          score: { $meta: "textScore" },
        }
      },
      { $sort: { score: -1, followersCount: -1 } },
      { $skip: skip }, { $limit: limit },
      { $project: baseProject },
    ];

    const pipelineRegex = [
      { $match: { $or: [{ username: rx }, { fname: rx }, { lname: rx }] } },
      { $addFields: {
          followersCount: { $size: { $ifNull: ["$followers", []] } },
          followingCount: { $size: { $ifNull: ["$following", []] } },
          isFollowing: { $in: ["$_id", followingIds] },
        }
      },
      { $sort: { followersCount: -1, username: 1 } },
      { $skip: skip }, { $limit: limit },
      { $project: baseProject },
    ];

    let docs;
    try {
      // try text search
      docs = await Profile.aggregate(pipelineText).collation({ locale: "en", strength: 2 });
    } catch (e) {
      // fallback to regex if text index missing
      docs = await Profile.aggregate(pipelineRegex).collation({ locale: "en", strength: 2 });
    }

    res.json({ results: docs, page, hasMore: docs.length === limit });
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};

export const verifyPassword = async (req, res) => {
  try {
    const { currentPassword } = req.body || {};
    if (!currentPassword) return res.status(400).json({ message: "Current password required" });

    // req.user is populated by auth middleware
    const me = await Profile.findById(req.user._id);
    if (!me) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(currentPassword, me.password);
    if (!ok) return res.status(401).json({ message: "Current password is incorrect" });

    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ message: "Verification failed", error: e.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirm } = req.body || {};
    if (!currentPassword || !newPassword || !confirm) {
      return res.status(400).json({ message: "All password fields are required" });
    }
    if (newPassword !== confirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    // same strength as your signup rule
    const strong =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/.test(newPassword);
    if (!strong) {
      return res.status(400).json({
        message:
          "Password must be 8+ chars and include lowercase, uppercase, number and special char",
      });
    }

    const me = await Profile.findById(req.user._id);
    if (!me) return res.status(404).json({ message: "User not found" });

    const ok = await bcrypt.compare(currentPassword, me.password);
    if (!ok) return res.status(401).json({ message: "Current password is incorrect" });

    me.password = newPassword; // will be hashed by pre('save')
    await me.save();

    // Optionally rotate token (keeps the user signed in with a fresh cookie)
    const token = generateToken(me._id);
    return res
      .cookie("access_token", token, { httpOnly: true })
      .json({ ok: true, message: "Password changed successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Change failed", error: e.message });
  }
};