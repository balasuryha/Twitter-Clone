import React, { useMemo, useState } from "react";
import { uploadImages, uploadVideo } from "../api/requests/upload";
import { newTweet as createTweet } from "../api/requests/tweet";

export default function Composer() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);     // images: File[]
  const [video, setVideo] = useState(null);   // video: File | null
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const imagePreviews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  const videoPreview = useMemo(() => (video ? URL.createObjectURL(video) : null), [video]);

  const onPickImages = (e) => {
    setError("");
    if (video) {
      setError("Remove the video to add images.");
      e.target.value = "";
      return;
    }
    const selected = Array.from(e.target.files || []);
    const images = selected.filter((f) => /^image\/(png|jpe?g|gif|webp)$/i.test(f.type));
    setFiles((prev) => [...prev, ...images].slice(0, 4));
    e.target.value = ""; // reset input
  };

  const onPickVideo = (e) => {
    setError("");
    if (files.length > 0) {
      setError("Remove images to add a video.");
      e.target.value = "";
      return;
    }
    const f = e.target.files?.[0];
    if (!f) return;
    if (!/^video\/(mp4|webm)$/i.test(f.type)) {
      setError("Only MP4 or WebM videos are allowed.");
      e.target.value = "";
      return;
    }
    // client-side size guard (50MB)
    const MAX_MB = 50;
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`Video is larger than ${MAX_MB}MB.`);
      e.target.value = "";
      return;
    }
    setVideo(f);
    e.target.value = "";
  };

  const removeImageAt = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));
  const removeVideo = () => setVideo(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const hasText = !!text.trim();
    const hasImages = files.length > 0;
    const hasVideo = !!video;

    if (!hasText && !hasImages && !hasVideo) {
      setError("Write text, add images, or add a video.");
      return;
    }
    if (text.length > 280) {
      setError("Max 280 characters.");
      return;
    }

    setLoading(true);
    try {
      let media = [];

      if (hasVideo) {
        // Upload one video, server returns { url }
        const url = await uploadVideo(video); // single string
        media = [url];
      } else if (hasImages) {
        // Upload images, server returns array of urls
        const urls = await uploadImages(files);
        media = urls;
      }

      await createTweet({ body: text.trim(), media });
      // reset
      setText("");
      setFiles([]);
      setVideo(null);
    } catch (err) {
      // err could be a thrown Error or axios error response; handle both
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to post";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = !loading && (text.trim() || files.length > 0 || !!video);

  return (
    <form onSubmit={onSubmit} style={box}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={280}
        placeholder="What's happening?"
        style={{ ...ta, borderColor: error ? "#ff6b6b" : "#ddd" }}
      />

      {/* Image previews */}
      {imagePreviews.length > 0 && (
        <div style={grid}>
          {imagePreviews.map((src, i) => (
            <div key={i} style={thumb}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button type="button" onClick={() => removeImageAt(i)} style={xbtn} title="Remove">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Video preview */}
      {videoPreview && (
        <div style={{ ...thumb, aspectRatio: "16 / 9", marginTop: 8 }}>
          <video src={videoPreview} controls style={{ width: "100%", height: "100%", borderRadius: 8 }} />
          <button type="button" onClick={removeVideo} style={xbtn} title="Remove">×</button>
        </div>
      )}

      <div style={row}>
        <label style={{ ...pickBtn, opacity: video ? 0.5 : 1, cursor: video ? "not-allowed" : "pointer" }}>
          📷 Add images
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onPickImages}
            disabled={!!video}
          />
        </label>

        <label style={{ ...pickBtn, opacity: files.length ? 0.5 : 1, cursor: files.length ? "not-allowed" : "pointer" }}>
          🎬 Add video
          <input
            type="file"
            accept="video/mp4,video/webm"
            hidden
            onChange={onPickVideo}
            disabled={files.length > 0}
          />
        </label>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#777" }}>{text.length}/280</span>
          <button disabled={!canSubmit}>{loading ? "Posting…" : "Tweet"}</button>
        </div>
      </div>

      {error && <div style={{ marginTop: 8, color: "#c0392b" }}>{error}</div>}
    </form>
  );
}

const box  = { border: "1px solid #eee", borderRadius: 12, padding: 12, background: "#fff" };
const ta   = { width: "100%", minHeight: 90, resize: "vertical", border: "1px solid #ddd", borderRadius: 8, padding: 8 };
const row  = { display: "flex", alignItems: "center", gap: 12, marginTop: 8 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginTop: 8 };
const thumb= { position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: 8, overflow: "hidden", border: "1px solid #eee" };
const xbtn = { position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: 999, border: "none", background: "#0008", color: "#fff", cursor: "pointer" };
const pickBtn = { padding: "6px 10px", border: "1px solid #ddd", borderRadius: 8, background: "#fafafa" };
