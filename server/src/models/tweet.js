// models/tweet.js
import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const { Schema, model } = mongoose;

/* ---------- Poll sub-schemas ---------- */
const OptionSchema = new Schema(
  {
    text: { type: String, required: true },
    votes: { type: Number, default: 0 },
  },
  { _id: false }
);

const PollSchema = new Schema(
  {
    question: { type: String, required: true },
    options: {
      type: [OptionSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2 && v.length <= 4,
        message: "Poll must have 2–4 options",
      },
    },
    expiresAt: { type: Date, required: true },
    voters: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        autopopulate: { select: "username _id", maxDepth: 1 },
      },
    ],
  },
  { _id: false }
);

/* ---------- Tweet schema ---------- */
const tweetSchema = new Schema(
  {
    body: { type: String },
    type: { type: String, enum: ["tweet", "reply", "retweet"], required: true },

    originalTweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
      autopopulate: true,
    },

    retweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],

    author: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      autopopulate: { select: "username fname lname avatar", maxDepth: 2 },
    },

    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        autopopulate: { select: "username", maxDepth: 1 },
      },
    ],

    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tweet",
        autopopulate: { maxDepth: 1 },
      },
    ],

    // ⬇️ Optional poll
    poll: { type: PollSchema, default: null },
  },
  {
    timestamps: true,
    collection: "tweets",
  }
);

tweetSchema.plugin(autopopulate);

const Tweet = model("Tweet", tweetSchema);
export default Tweet;
