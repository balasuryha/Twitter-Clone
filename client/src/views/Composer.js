import React, { useMemo, useState } from "react";
import { uploadImages } from "../api/requests/upload";
import { createTweet } from "../api/requests/tweet";

export default function Composer() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]); // File[]
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  const onPick = (e) => {
    const selected = Array.from(e.target.files || []);
    // images only, cap at 4 combined
    const images = selected.filter((f) => /^image\/(png|jpe?g|gif|webp)$/i.test(f.type));
    setFiles((prev) => [...prev, ...images].slice(0, 4));
    e.target.value = ""; // reset input
  };

  const removeAt = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!text.trim() && files.length === 0) return setError("Write text or add images");
    if (text.length > 280) return setError("Max 280 characters");

    setLoading(true);
    try {
      let urls = [];
      if (files.length) urls = await uploadImages(files); // server returns absolute URLs
      await createTweet({ body: text.trim(), media: urls });
      setText("");
      setFiles([]);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={box}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={280}
        placeholder="What's happening?"
        style={{ ...ta, borderColor: error ? "#ff6b6b" : "#ddd" }}
      />
      {previews.length > 0 && (
        <div style={grid}>
          {previews.map((src, i) => (
            <div key={i} style={thumb}>
              <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button type="button" onClick={() => removeAt(i)} style={xbtn} title="Remove">
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div style={row}>
        <label style={pickBtn}>
          📷 Add images
          <input type="file" accept="image/*" multiple hidden onChange={onPick} />
        </label>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#777" }}>{text.length}/280</span>
          <button disabled={loading || (!text.trim() && files.length === 0)}>
            {loading ? "Posting…" : "Tweet"}
          </button>
        </div>
      </div>
      {error && <div style={{ marginTop: 8, color: "#c0392b" }}>{error}</div>}
    </form>
  );
}

const box = { border: "1px solid #eee", borderRadius: 12, padding: 12, background: "#fff" };
const ta = { width: "100%", minHeight: 90, resize: "vertical", border: "1px solid #ddd", borderRadius: 8, padding: 8 };
const row = { display: "flex", alignItems: "center", gap: 12, marginTop: 8 };
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 8, marginTop: 8 };
const thumb = { position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: 8, overflow: "hidden", border: "1px solid #eee" };
const xbtn = { position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: 999, border: "none", background: "#0008", color: "#fff", cursor: "pointer" };
