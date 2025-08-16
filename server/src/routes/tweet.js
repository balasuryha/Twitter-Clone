import express from "express";
import auth from "../middlewares/auth.js";
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
} from "../controllers/tweet.controller.js";

const router = express.Router();

// READ (static paths FIRST)
router.get("/following", auth, getFollowingTweets);
router.get("/profile", auth, getProfileTweets);     // ?username=...&page=...

// Global feed (page query) -> GET /tweet?page=1
router.get("/", getTweet);

// Single tweet by id MUST be last among GETs
router.get("/:id", getTweet);                       // GET /tweet/:id

// CREATE
router.post("/new", auth, newTweet);                // POST /tweet/new
router.post("/reply/new/:id", auth, newReply);      // POST /tweet/reply/new/:id
router.post("/retweet/:id", auth, retweet);         // POST /tweet/retweet/:id

// MUTATE
router.patch("/edit/:id", auth, editTweet);         // PATCH /tweet/edit/:id
router.post("/like/:id", auth, likeTweet);          // POST /tweet/like/:id
router.patch("/unlike/:id", auth, unlikeTweet);     // PATCH /tweet/unlike/:id

// DELETE
router.delete("/delete/:id", auth, deleteTweet);    // DELETE /tweet/delete/:id
router.delete("/comment/delete/:id", auth, deleteReply); // DELETE /tweet/comment/delete/:id

export default router;
