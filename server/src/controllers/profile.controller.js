import Profile from "../models/profile.js";
import Tweet from "../models/tweet.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax", // important for localhost client + cookie auth
  ...(process.env.NODE_ENV === "production" ? { secure: true } : {}),
};

// SIGN UP
export const signUp = async (req, res) => {
  try {
    const { username, email, password, fname, lname } = req.body || {};
    if (!username || !email || !password) {
      return res.status(400).json({ errors: [{ msg: "username, email, password required" }] });
    }

    const exists = await Profile.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (exists) {
      return res.status(409).json({ errors: [{ msg: "User already exists" }] });
    }

    const profile = await Profile.create({ username, email, password, fname, lname });
    const token = generateToken(profile._id);

    // never return password
    const safe = await Profile.findById(profile._id).select("-password");

    return res
      .cookie("access_token", token, cookieOpts)
      .status(201)
      .json(safe);
  } catch (err) {
    // handle possible duplicate-key race
    if (err?.code === 11000) {
      return res.status(409).json({ errors: [{ msg: "User already exists" }] });
    }
    console.error("signUp error:", err);
    return res.status(500).json({ errors: [{ msg: "Sign up failed" }] });
  }
};

// SIGN IN
export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ errors: [{ msg: "username and password required" }] });
    }

    const profile = await Profile.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!profile) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const ok = await bcrypt.compare(password, profile.password);
    if (!ok) {
      return res.status(401).json({ errors: [{ msg: "Invalid credentials" }] });
    }

    const token = generateToken(profile._id);
    await profile.signIn();

    const safe = await Profile.findById(profile._id).select("-password");

    return res
      .cookie("access_token", token, cookieOpts)
      .status(200)
      .json(safe);
  } catch (err) {
    console.error("signIn error:", err);
    return res.status(500).json({ errors: [{ msg: "Sign in failed" }] });
  }
};

// SIGN OUT
export const signOut = async (req, res) => {
  try {
    const profile = req.user;
    if (profile) await profile.signOut();
    // clear with the same cookie options to ensure removal
    return res
      .clearCookie("access_token", cookieOpts)
      .status(200)
      .json({ msg: "Successfully signed out." });
  } catch (err) {
    console.error("signOut error:", err);
    return res.status(500).json({ errors: [{ msg: "Sign out failed" }] });
  }
};

// FOLLOW PROFILE
export const follow = async (req, res) => {
  try {
    const { username } = req.query;
    const user = req.user;
    const profile = await Profile.findOne({ username });
    if (!profile) return res.status(404).json({ errors: [{ msg: "User not found" }] });
    await user.follow(profile);
    res.status(200).json(profile);
  } catch (err) {
    console.error("follow error:", err);
    res.status(500).json({ errors: [{ msg: "Follow failed" }] });
  }
};

// UNFOLLOW PROFILE
export const unfollow = async (req, res) => {
  try {
    const { username } = req.query;
    const user = req.user;
    const profile = await Profile.findOne({ username });
    if (!profile) return res.status(404).json({ errors: [{ msg: "User not found" }] });
    await user.unfollow(profile);
    return res.status(200).json(profile);
  } catch (err) {
    console.error("unfollow error:", err);
    res.status(500).json({ errors: [{ msg: "Unfollow failed" }] });
  }
};

// GET PROFILE BY USERNAME OR ALL
export const getProfile = async (req, res) => {
  try {
    const { username } = req.query;
    if (username) {
      const profile = await Profile.findOne({ username }, { password: 0 });
      return res.status(200).json(profile);
    } else {
      const profiles = await Profile.find({}, { password: 0 });
      return res.status(200).json(profiles);
    }
  } catch (err) {
    console.error("getProfile error:", err);
    res.status(500).json({ errors: [{ msg: "Failed to fetch profile(s)" }] });
  }
};

export const getCurrentProfile = (req, res) => {
  const profile = req.user;
  res.status(200).json(profile);
};

// BOOKMARKS
export const addBookmark = async (req, res) => {
  try {
    const { id } = req.query;
    const profile = req.user;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ errors: [{ msg: "Tweet not found" }] });
    await profile.addBookmark(tweet);
    res.status(200).json(profile);
  } catch (err) {
    console.error("addBookmark error:", err);
    res.status(500).json({ errors: [{ msg: "Failed to add bookmark" }] });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const { user } = req;
    const bookmarks = await Tweet.find({
      _id: { $in: user.bookmarks },
      $or: [{ type: "tweet" }, { type: "retweet" }],
    }).sort("-createdAt");
    res.status(200).json(bookmarks);
  } catch (err) {
    console.error("getBookmarks error:", err);
    res.status(500).json({ errors: [{ msg: "Failed to fetch bookmarks" }] });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { id } = req.query;
    const profile = req.user;
    const tweet = await Tweet.findById(id);
    if (!tweet) return res.status(404).json({ errors: [{ msg: "Tweet not found" }] });
    await profile.removeBookmark(tweet);
    res.status(200).json(profile);
  } catch (err) {
    console.error("removeBookmark error:", err);
    res.status(500).json({ errors: [{ msg: "Failed to remove bookmark" }] });
  }
};

// EDIT PROFILE BIO / AVATAR
export const uploadAvatar = async (req, res) => {
  try {
    const { user, avatar } = req;
    await user.changeAvatar(avatar);
    res.status(200).json(user);
  } catch (err) {
    console.error("uploadAvatar error:", err);
    res.status(500).json({ errors: [{ msg: "Failed to upload avatar" }] });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { user } = req;
    const body = req.body;
    await user.updateProfile(body);
    res.status(200).json(user);
  } catch (err) {
    console.error("editProfile error:", err);
    res.status(500).json({ errors: [{ msg: "Failed to update profile" }] });
  }
};
