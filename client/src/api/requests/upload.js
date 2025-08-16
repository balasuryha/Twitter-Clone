import axios from "axios";
axios.defaults.withCredentials = true;

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function uploadImages(files) {
  const fd = new FormData();
  files.slice(0, 4).forEach((f) => fd.append("images", f));
  const res = await axios.post(`${BASE}/uploads-api/image`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.urls; // [string]
}

// Single video (mp4/webm), <= 50MB
export async function uploadVideo(file, { maxSizeMB = 50 } = {}) {
  if (!file) throw new Error("No video file provided");
  if (!/^video\/(mp4|webm)$/i.test(file.type)) throw new Error("Only MP4 or WebM videos are allowed");
  if (file.size > maxSizeMB * 1024 * 1024) throw new Error(`Video is larger than ${maxSizeMB}MB`);

  const fd = new FormData();
  fd.append("video", file);
  const res = await axios.post(`${BASE}/uploads-api/video`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.url; // string
}
