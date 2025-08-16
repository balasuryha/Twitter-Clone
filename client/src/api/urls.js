// client/src/api/urls.js

// Base API URL (env wins, else localhost)
export const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

/* ---------------- PROFILE ENDPOINTS ---------------- */
export const SIGN_UP            = `${BASE}/profile/sign-up`;
export const SIGN_OUT           = `${BASE}/profile/sign-out`;
export const SIGN_IN            = `${BASE}/profile/sign-in`;

export const UPDATE_PROFILE     = `${BASE}/profile/edit`;
export const UPLOAD_AVATAR      = `${BASE}/profile/upload-avatar`;

export const FOLLOW_ID          = `${BASE}/profile/follow?id=`;       // if your server uses query for follow
export const FOLLOW_NAME        = `${BASE}/profile/follow?username=`;
export const UNFOLLOW_ID        = `${BASE}/profile/unfollow?id=`;
export const UNFOLLOW_NAME      = `${BASE}/profile/unfollow?username=`;

export const GET_CURRENT_PROFILE= `${BASE}/profile/current`;
export const GET_ALL_PROFILES   = `${BASE}/profile?page=`;
export const GET_PROFILE_USERNAME = `${BASE}/profile?username=`;
export const GET_PROFILE_ID     = `${BASE}/profile?id=`;

export const ADD_BOOKMARK       = `${BASE}/profile/bookmark/add?id=`;
export const REMOVE_BOOKMARK    = `${BASE}/profile/bookmark/remove?id=`;
export const GET_BOOKMARK       = `${BASE}/profile/bookmarks`;

/* ------------------ TWEET ENDPOINTS ----------------- */
// Create
export const NEW_TWEET          = `${BASE}/tweet/new`;

// Read
export const GET_ALL_TWEETS     = `${BASE}/tweet?page=`;               // + page
export const GET_FOLLOWING_TWEETS = `${BASE}/tweet/following?page=`;   // + page
export const GET_PROFILE_TWEETS = `${BASE}/tweet/profile?username=`;   // + username
export const GET_TWEET_ID       = `${BASE}/tweet/`;                    // + :id

// Actions (PATH PARAMS – matches your updated server routes)
export const RETWEET            = `${BASE}/tweet/retweet/`;            // + :id
export const EDIT_TWEET         = `${BASE}/tweet/edit/`;               // + :id
export const DELETE_TWEET       = `${BASE}/tweet/delete/`;             // + :id
export const LIKE_TWEET         = `${BASE}/tweet/like/`;               // + :id
export const UNLIKE_TWEET       = `${BASE}/tweet/unlike/`;             // + :id
export const NEW_REPLY          = `${BASE}/tweet/reply/new/`;          // + :id (parent tweet)
export const DELETE_COMMENT     = `${BASE}/tweet/comment/delete/`;     // + :id (reply id, if implemented)

/* ------------------ UPLOADS ----------------- */
export const UPLOAD_IMAGES      = `${BASE}/uploads-api/image`;
export const UPLOAD_VIDEO       = `${BASE}/uploads-api/video`;
