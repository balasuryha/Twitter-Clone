// server/src/models/profile.js
import mongoose from "mongoose";
import Tweet from "./tweet.js";
import getDate from "../utils/getDate.js";
import autopopulate from "mongoose-autopopulate";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const profileSchema = new Schema(
  {
    isOnline: { type: Boolean, default: false },

    fname: { type: String, trim: true },
    lname: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },

    password: { type: String, required: true },

    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    avatar: String,
    banner: String,

    tweets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
        autopopulate: { maxDepth: 2 },
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        autopopulate: { select: "username _id", maxDepth: 1 },
      },
    ],

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        autopopulate: { select: "username _id", maxDepth: 1 },
      },
    ],

    notifications: { type: Array, default: [] },

    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
        autopopulate: { maxDepth: 2 },
      },
    ],
  },
  { timestamps: true, collection: "profiles" }
);

// ---------- Instance methods ----------
class ProfileClass {
  // AUTH
  signIn() {
    this.isOnline = true;
    this.notifications.unshift({
      type: "twitter",
      message: `There was a login to your account @${
        this.username
      } from a new device ${getDate()}. Review it now.`,
    });
    return this.save();
  }

  signOut() {
    this.isOnline = false;
    return this.save();
  }

  // PROFILE
  changeAvatar(url) {
    this.avatar = url;
    return this.save();
  }

  updateProfile({ fname, lname, bio, location, website }) {
    this.fname = fname;
    this.lname = lname;
    this.location = location;
    this.website = website;
    this.bio = bio;
    return this.save();
  }

  // TWEETS
  tweet(tweet) {
    this.tweets.push(tweet);
    return this.save();
  }

  async retweet(originalTweet) {
    const retweet = new Tweet({ author: this, type: "retweet" });
    retweet.originalTweet = originalTweet;
    this.tweets.push(retweet);
    originalTweet.retweets.push(retweet);
    await retweet.save();
    await originalTweet.save();
    await this.save();
  }

  deleteTweet(id) {
    this.tweets = this.tweets.filter((t) => String(t._id) !== String(id));
    return this.save();
  }

  editTweet(tweet, body) {
    tweet.body = body;
    return tweet.save();
  }

  // REPLIES
  newReply(tweet, reply) {
    tweet.replies.unshift(reply);
    return tweet.save();
  }

  deleteReply(_tweet, _comment) {
    // TODO
  }

  // LIKES (works with ObjectIds or populated docs)
  like(tweet) {
    const myId = String(this._id);
    const already = tweet.likes.some((l) => String(l._id || l) === myId);
    if (already) return;
    tweet.likes.push(this._id);
    return tweet.save();
  }

  unlike(tweet) {
    const myId = String(this._id);
    tweet.likes = tweet.likes.filter((l) => String(l._id || l) !== myId);
    return tweet.save();
  }

  // BOOKMARKS
  addBookmark(tweet) {
    this.bookmarks.push(tweet);
    return this.save();
  }

  removeBookmark(tweet) {
    this.bookmarks = this.bookmarks.filter(
      (b) => String(b._id) !== String(tweet._id)
    );
    return this.save();
  }

  // FOLLOW / UNFOLLOW
  async follow(profile) {
    if (this.following.find((f) => f.username === profile.username)) return;

    profile.followers.push(this);
    profile.notifications.unshift({
      type: "follow",
      message: `${this.username} has started following you ${getDate()}`,
    });
    this.following.push(profile);

    await this.save();
    await profile.save();
  }

  async unfollow(profile) {
    profile.followers = profile.followers.filter(
      (f) => f.username !== this.username
    );
    this.following = this.following.filter(
      (f) => f.username !== profile.username
    );
    await this.save();
    await profile.save();
  }
}

// ---------- Hooks ----------
profileSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

profileSchema.plugin(autopopulate);
profileSchema.loadClass(ProfileClass);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
