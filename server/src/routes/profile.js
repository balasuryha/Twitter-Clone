import express from "express";
import upload from "../middlewares/multer.js";
import {
  addBookmark,
  removeBookmark,
  uploadAvatar,
  getProfile,
  signUp,
  signIn,
  signOut,
  follow,
  unfollow,
  getCurrentProfile,
  editProfile,
  getBookmarks,
  searchProfiles,
  verifyPassword,
  changePassword,
} from "../controllers/profile.controller.js";
import auth from "../middlewares/auth.js";
import {
  validateRequest,
  validateSchema,
} from "../middlewares/validate-request.js";

const router = express.Router();

router.get("/", getProfile);
router.get("/current", auth, getCurrentProfile);
router.get("/bookmarks", auth, getBookmarks);

router.post("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);
router.post("/edit", auth, editProfile);

router.post("/sign-up", validateSchema, validateRequest, signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", auth, signOut);

router.post("/follow", auth, follow);
router.patch("/unfollow", auth, unfollow);

router.post("/bookmark/add", auth, addBookmark);
router.patch("/bookmark/remove", auth, removeBookmark);

router.get("/search", auth, searchProfiles); // <-- add this

router.post("/verify-password", auth, verifyPassword);
router.post("/change-password", auth, changePassword);

export default router;
