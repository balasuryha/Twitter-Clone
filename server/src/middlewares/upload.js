import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${base}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  // allow images only
  if (/^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype)) return cb(null, true);
  cb(new Error("Only image files are allowed"));
}

export const uploadImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 }, // 5MB each, max 4
});
// add under uploadImages
function videoFilter(_req, file, cb) {
  if (/^video\/(mp4|webm)$/i.test(file.mimetype)) return cb(null, true);
  cb(new Error("Only MP4 or WebM video allowed"));
}
export const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: 50 * 1024 * 1024, files: 1 } 
});

