// models/profile.js
import mongoose from "mongoose";
import Tweet from "./tweet.js";
import getDate from "../utils/getDate.js";
import autopopulate from "mongoose-autopopulate";
import bcrypt from "bcryptjs";
import { sendPushToUser } from "../services/push.js";

const { Schema } = mongoose;

const profileSchema = new Schema(
  {
    isOnline: Boolean,
    fname: String,
    lname: String,
    email: String,
    username: String,
    password: String,
    bio: String,
    location: String,
    website: String,
    avatar: String,
    banner: String,
    tweets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        autopopulate: { maxDepth: 2 },
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        autopopulate: { select: "username _id", maxDepth: 1 },
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        autopopulate: { select: "username _id", maxDepth: 1 },
      },
    ],
    // keep simple objects for flexibility
    notifications: Array,
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        autopopulate: { maxDepth: 2 },
      },
    ],
  },
  { timestamps: true },
  { collection: "profiles" }
);

// -------------------- Schema methods --------------------
class ProfileClass {
  // ---------- AUTH ----------
  signIn() {
    this.isOnline = true;
    this.notifications = this.notifications || [];
    this.notifications.unshift({
      type: "twitter",
      message: `There was a login to your account @${this.username} from a new device ${getDate()}. Review it now.`,
      createdAt: new Date(),
    });
    return this.save();
  }

  signOut() {
    this.isOnline = false; // correct: user is offline after sign out
    return this.save();
  }

  // ---------- PROFILE EDIT ----------
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

  // ---------- TWEETS ----------
  tweet(tweet) {
    this.tweets.push(tweet);
    return this.save();
  }

  // RETWEET (notify original author)
  async retweet(originalTweet) {
    const retweet = new Tweet({ author: this, type: "retweet" });
    retweet.originalTweet = originalTweet;
    this.tweets.push(retweet);
    originalTweet.retweets.push(retweet);

    await retweet.save();
    await originalTweet.save();
    await this.save();

    const authorId = originalTweet.author?._id ?? originalTweet.author;
    if (String(authorId) !== String(this._id)) {
      await this._notify(authorId, {
        type: "retweet",
        message: `${this.username} retweeted your tweet ${getDate()}`,
        tweetId: String(originalTweet._id),
        actor: { _id: this._id, username: this.username, avatar: this.avatar },
      });
    }
  }

  deleteTweet(id) {
    this.tweets = this.tweets.filter((t) => String(t._id) !== String(id));
    return this.save();
  }

  editTweet(tweet, body) {
    tweet.body = body;
    return tweet.save();
  }

  // REPLY (notify tweet author)
  async newReply(tweet, reply) {
    tweet.replies.unshift(reply);
    await tweet.save();

    const authorId = tweet.author?._id ?? tweet.author;
    if (String(authorId) !== String(this._id)) {
      await this._notify(authorId, {
        type: "reply",
        message: `${this.username} replied to your tweet ${getDate()}`,
        tweetId: String(tweet._id),
        actor: { _id: this._id, username: this.username, avatar: this.avatar },
      });
    }
  }

  // ---------- LIKES ----------
  async like(tweet) {
    const didThisUserLiked = tweet.likes.find(
      (like) => like.username === this.username
    );
    if (didThisUserLiked) return;

    tweet.likes.push(this);
    await tweet.save();

    const authorId = tweet.author?._id ?? tweet.author;
    if (String(authorId) !== String(this._id)) {
      await this._notify(authorId, {
        type: "like",
        message: `${this.username} liked your tweet ${getDate()}`,
        tweetId: String(tweet._id),
        actor: { _id: this._id, username: this.username, avatar: this.avatar },
      });
    }
  }

  unlike(tweet) {
    tweet.likes = tweet.likes.filter(
      (like) => like.username !== this.username
    );
    return tweet.save();
  }

  // ---------- BOOKMARKS ----------
  addBookmark(tweet) {
    this.bookmarks.push(tweet);
    return this.save();
  }

  removeBookmark(tweet) {
    this.bookmarks = this.bookmarks.filter(
      (bookmark) => String(bookmark._id) !== String(tweet._id)
    );
    return this.save();
  }

  // ---------- FOLLOW / UNFOLLOW ----------
  async follow(profile) {
    if (this.following.find((f) => f.username === profile.username)) return;

    profile.followers.push(this);
    this.following.push(profile);

    await this.save();
    await profile.save();

    // notify target user
    await this._notify(profile._id, {
      type: "follow",
      message: `${this.username} has started following you ${getDate()}`,
      actor: { _id: this._id, username: this.username, avatar: this.avatar },
    });
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

  // ---------- Notification helper (also sends PUSH) ----------
  async _notify(targetUserId, payload) {
    try {
      const ProfileModel = this.model("Profile");
      const target = await ProfileModel.findById(targetUserId);
      if (!target) return;

      target.notifications = target.notifications || [];
      target.notifications.unshift({
        ...payload,
        createdAt: new Date(),
      });

      // keep last 100 (optional)
      if (target.notifications.length > 100) {
        target.notifications = target.notifications.slice(0, 100);
      }

      await target.save();

      // Send a browser push too (best-effort)
      try {
        const title = "Twitter Clone";
        const url =
          payload.url ??
          (payload.tweetId ? `/tweet/${payload.tweetId}` : "/notifications");

        await sendPushToUser(target._id, {
          title,
          body: payload.message,
          url,
        });
      } catch (pushErr) {
        console.error("sendPush error:", pushErr?.message || pushErr);
      }
    } catch (e) {
      console.error("notify error:", e.message);
    }
  }
}

// ---------- Password hash on change only ----------
profileSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

profileSchema.plugin(autopopulate);
profileSchema.loadClass(ProfileClass);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
