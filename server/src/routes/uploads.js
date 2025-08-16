import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
  },
});
const upload = multer({ storage });

// IMAGES (≤4)  -> { urls: [ ...absolute URLs... ] }
router.post("/image", upload.array("images", 4), (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const urls = (req.files || []).map((f) => `${base}/uploads/${f.filename}`);
  res.json({ urls });
});

// VIDEO (single) -> { url: <absolute URL> }
router.post("/video", upload.single("video"), (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const url = req.file ? `${base}/uploads/${req.file.filename}` : null;
  res.json({ url });
});

export default router;
