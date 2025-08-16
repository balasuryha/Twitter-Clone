import express from "express";
import auth from "../middlewares/auth.js";
import { uploadImages } from "../middlewares/upload.js";

const router = express.Router();

/** POST /uploads-api/image  (multipart form-data, field name: "images") */
router.post("/image", auth, uploadImages.array("images", 4), (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const urls = (req.files || []).map((f) => `${base}/uploads/${f.filename}`);
  return res.status(201).json({ urls });
});

export default router;
