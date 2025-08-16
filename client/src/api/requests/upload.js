import axios from "axios";
axios.defaults.withCredentials = true;

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function uploadImages(files) {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f));
  const res = await axios.post(`${BASE}/uploads-api/image`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.urls; 
}
