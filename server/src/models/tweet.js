import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const { Schema, model } = mongoose;

const tweetSchema = new Schema(
  {
    body: { type: String, default: "" },

    type: {
      type: String,
      enum: ["tweet", "reply", "retweet"],
      required: true,
    },

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

    
    media: [
      {
        type: { type: String, enum: ["image", "video"], required: true },
        url: { type: String, required: true },
      },
    ],

  
    hashtags: [{ type: String, lowercase: true, trim: true }],
    mentions: [{ type: Schema.Types.ObjectId, ref: "Profile" }],
  },
  { timestamps: true, collection: "tweets" }
);

// Plugins
tweetSchema.plugin(autopopulate);

// Helpful indexes
tweetSchema.index({ author: 1, createdAt: -1 });
tweetSchema.index({ createdAt: -1 });
tweetSchema.index({ originalTweet: 1 });
tweetSchema.index({ hashtags: 1 });
tweetSchema.index({ mentions: 1 });

const Tweet = model("Tweet", tweetSchema);
export default Tweet;
