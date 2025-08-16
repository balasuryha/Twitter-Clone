// routes/tweet.routes.js
import express from "express";
import {
  retweet,
  getTweet,
  getFollowingTweets,
  getProfileTweets,
  newTweet,
  deleteTweet,
  editTweet,
  likeTweet,
  unlikeTweet,
  newReply,
  deleteReply,
  votePoll,
} from "../controllers/tweet.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

/* GET */
router.get("/", getTweet);
router.get("/following", auth, getFollowingTweets);
router.get("/profile", auth, getProfileTweets);

/* CREATE / UPDATE / DELETE */
router.post("/new", auth, newTweet);
router.post("/retweet", auth, retweet);
router.post("/reply/new", auth, newReply);
router.delete("/delete", auth, deleteTweet);
router.delete("/comment/delete", auth, deleteReply);
router.patch("/edit", auth, editTweet);
router.post("/like", auth, likeTweet);
router.patch("/unlike", auth, unlikeTweet);

/* Poll vote */
router.post("/poll/vote", auth, votePoll);

export default router;
