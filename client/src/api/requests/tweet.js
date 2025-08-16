import * as url from "../urls";
import axios from "axios";

axios.defaults.withCredentials = true;

// Normalize all responses so reducers can safely do: const { status, data } = action.payload;
const box = (res) => ({
  status: res?.status ?? 500,
  data:   res?.data ?? { message: "Request failed" }
});

/* -------------------------- Image Upload (NEW) -------------------------- */
/**
 * Upload up to 4 images and get back an array of absolute URLs from the server.
 * @param {File[]} files
 * @returns {Promise<{status:number, data:{urls:string[]}}>}
 */
export const uploadImages = async (files = []) => {
  const fd = new FormData();
  files.slice(0, 4).forEach((f) => fd.append("images", f));

  try {
    const res = await axios.post(url.UPLOAD_IMAGES, fd); // server sets Content-Type
    return box(res); // -> { status, data: { urls: [...] } }
  } catch (e) {
    return box(e?.response);
  }
};

/**
 * Helper: create a tweet with text + images Files (does upload first).
 * Usage: newTweetWithImages({ body: "hello", files })
 */
export const newTweetWithImages = async ({ body = "", files = [] } = {}) => {
  const up = files.length ? await uploadImages(files) : { status: 200, data: { urls: [] } };
  if (up.status >= 400) return up;
  return newTweet({ body, media: up.data.urls });
};

/* ---------------------------- Tweet Requests ---------------------------- */
export const newTweet = async (data) => {
  try {
    const res = await axios.post(url.NEW_TWEET, data); // data: { body, media?: string[] }
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};

export const editTweet = async (data, tweetId) => {
  try {
    const res = await axios.patch(url.EDIT_TWEET + tweetId, data);
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};

export const deleteTweet = async (tweetId) => {
  try {
    const res = await axios.delete(url.DELETE_TWEET + tweetId);
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};

export const likeTweet = async (tweetId) => {
  try {
    const res = await axios.post(url.LIKE_TWEET + tweetId);
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};

export const unlikeTweet = async (tweetId) => {
  try {
    const res = await axios.patch(url.UNLIKE_TWEET + tweetId);
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};

export const newReply = async (data, tweetId) => {
  try {
    const res = await axios.post(url.NEW_REPLY + tweetId, { body: data });
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};

export const getAllTweets = async (page = 1) => {
  try {
    const res = await axios.get(url.GET_ALL_TWEETS + page);
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};

export const getFollowingTweets = async (page = 1) => {
  try {
    const res = await axios.get(url.GET_FOLLOWING_TWEETS + page);
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};

export const getTweetById = async (tweetId) => {
  try {
    const res = await axios.get(url.GET_TWEET_ID + tweetId);
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};

export const getProfileTweets = async (username) => {
  try {
    const res = await axios.get(url.GET_PROFILE_TWEETS + username);
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};

export const retweet = async (tweetId) => {
  try {
    const res = await axios.post(url.RETWEET + tweetId);
    return box(res);
  } catch (e) {
    return box(e?.response);
  }
};
